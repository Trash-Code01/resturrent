const reservationSelect = `
  id,
  confirmation_code,
  reservation_date,
  reservation_time,
  guest_label,
  seating,
  experience,
  first_name,
  last_name,
  email,
  phone,
  special_requests,
  reservation_status,
  table_number,
  admin_notes,
  subtotal,
  created_at,
  reservation_preorders (
    id,
    menu_item_id,
    menu_item_name,
    unit_price,
    quantity,
    image_url
  )
`;

function formatSupabaseErrorMessage(message, fallbackMessage) {
  const normalizedMessage = (message || '').toLowerCase();

  if (
    normalizedMessage.includes('row-level security policy') &&
    normalizedMessage.includes('reservations')
  ) {
    return 'Your account is signed in, but the database is not accepting this reservation yet. Sign out, sign back in, refresh the page, and try again.';
  }

  if (
    normalizedMessage.includes('row-level security policy') &&
    normalizedMessage.includes('reservation_preorders')
  ) {
    return 'Your reservation was created, but the database rejected the pre-ordered dishes. Refresh the page and try again.';
  }

  if (
    normalizedMessage.includes('jwt') ||
    normalizedMessage.includes('token') ||
    normalizedMessage.includes('claim')
  ) {
    return 'Your session could not be verified with the reservation database. Sign out, sign back in, and try again.';
  }

  return message || fallbackMessage;
}

function ensureClient(client, area) {
  if (!client) {
    throw new Error(`${area} is not configured yet.`);
  }
}

function unwrapResponse(response, fallbackMessage) {
  if (response.error) {
    throw new Error(
      formatSupabaseErrorMessage(response.error.message, fallbackMessage),
    );
  }

  return response.data;
}

function createConfirmationCode() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

export async function submitReservation(client, payload) {
  ensureClient(client, 'Reservations');

  const preorders = payload.preorders.filter((item) => item.quantity > 0);
  const subtotal = preorders.reduce(
    (runningTotal, item) => runningTotal + item.price * item.quantity,
    0,
  );

  const reservationResponse = await client
    .from('reservations')
    .insert({
      confirmation_code: createConfirmationCode(),
      reservation_date: payload.date,
      reservation_time: payload.time,
      guest_label: payload.guests,
      seating: payload.seating,
      experience: payload.experience,
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      special_requests: payload.specialRequests,
      subtotal,
    })
    .select(reservationSelect)
    .single();

  const reservation = unwrapResponse(
    reservationResponse,
    'Unable to create reservation.',
  );

  if (preorders.length > 0) {
    const itemResponse = await client.from('reservation_preorders').insert(
      preorders.map((item) => ({
        reservation_id: reservation.id,
        menu_item_id: item.id,
        menu_item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        image_url: item.image,
      })),
    );

    unwrapResponse(itemResponse, 'Unable to save pre-ordered dishes.');
  }

  const refreshedReservation = await client
    .from('reservations')
    .select(reservationSelect)
    .eq('id', reservation.id)
    .single();

  return unwrapResponse(
    refreshedReservation,
    'Reservation was created, but could not be refreshed.',
  );
}

export async function fetchUserReservations(client) {
  ensureClient(client, 'Reservations');

  const response = await client
    .from('reservations')
    .select(reservationSelect)
    .order('reservation_date', { ascending: false })
    .order('created_at', { ascending: false });

  return unwrapResponse(response, 'Unable to load reservations.');
}

export async function submitContactMessage(client, payload) {
  ensureClient(client, 'Contact form');

  const response = await client.from('contact_messages').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    subject: payload.subject,
    message: payload.message,
  });

  unwrapResponse(response, 'Unable to send your message.');
}

export async function fetchAdminAccess(client) {
  ensureClient(client, 'Admin access');

  const response = await client
    .from('restaurant_admins')
    .select('clerk_user_id, email, full_name, created_at')
    .maybeSingle();

  return unwrapResponse(response, 'Unable to verify admin access.');
}

export async function fetchAdminReservations(client) {
  ensureClient(client, 'Admin reservations');

  const response = await client
    .from('reservations')
    .select(reservationSelect)
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true });

  return unwrapResponse(response, 'Unable to load reservations.');
}

export async function updateReservationManagement(client, reservationId, patch) {
  ensureClient(client, 'Reservation management');

  const response = await client
    .from('reservations')
    .update(patch)
    .eq('id', reservationId)
    .select(reservationSelect)
    .single();

  return unwrapResponse(response, 'Unable to update reservation.');
}

export async function fetchAdminContacts(client) {
  ensureClient(client, 'Admin contacts');

  const response = await client
    .from('contact_messages')
    .select(
      'id, first_name, last_name, email, phone, subject, message, status, created_at',
    )
    .order('created_at', { ascending: false });

  return unwrapResponse(response, 'Unable to load contact messages.');
}

export async function updateContactStatus(client, contactId, status) {
  ensureClient(client, 'Contact management');

  const response = await client
    .from('contact_messages')
    .update({ status })
    .eq('id', contactId)
    .select(
      'id, first_name, last_name, email, phone, subject, message, status, created_at',
    )
    .single();

  return unwrapResponse(response, 'Unable to update contact status.');
}

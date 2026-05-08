import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import clsx from 'clsx';
import Footer from '../components/sections/Footer';
import { createSupabaseAuthedClient } from '../lib/supabase';
import {
  fetchAdminContacts,
  fetchAdminReservations,
  updateContactStatus,
  updateReservationManagement,
} from '../lib/restaurantApi';
import {
  contactStatuses,
  getExperienceLabel,
  getSeatingLabel,
  reservationStatuses,
} from '../data/restaurant';
import {
  formatCurrency,
  formatDateTime,
  formatReservationDate,
} from '../lib/formatters';

const tabs = [
  { id: 'reservations', label: 'Reservations' },
  { id: 'contacts', label: 'Contacts' },
];

const shellClasses =
  'rounded-[30px] border border-white/8 bg-[#090909]/95 shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl';

const reservationStatusStyles = {
  pending: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  confirmed: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  preparing: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  completed: 'border-white/12 bg-white/[0.05] text-white/60',
  cancelled: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
};

const contactStatusStyles = {
  new: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  in_progress: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  resolved: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
};

const reservationPriority = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  completed: 3,
  cancelled: 4,
};

const contactPriority = {
  new: 0,
  in_progress: 1,
  resolved: 2,
};

function getReservationTimestamp(reservation) {
  return new Date(
    `${reservation.reservation_date}T${reservation.reservation_time}:00`,
  ).getTime();
}

const Shell = ({ children, className = '' }) => (
  <section className={clsx(shellClasses, className)}>{children}</section>
);

const SectionHeader = ({ eyebrow, title, detail }) => (
  <div className="mb-6">
    {eyebrow ? (
      <p className="text-[10px] uppercase tracking-[0.34em] text-[#d4af37]">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="mt-3 font-serif text-3xl uppercase tracking-tight text-white md:text-4xl">
      {title}
    </h2>
    {detail ? (
      <p className="mt-3 max-w-2xl text-sm leading-8 tracking-wide text-white/55">
        {detail}
      </p>
    ) : null}
  </div>
);

const KpiCard = ({ label, value, detail, accent = 'gold' }) => {
  const accentMap = {
    gold: 'from-[#d4af37]/18 to-transparent',
    blue: 'from-sky-400/16 to-transparent',
    emerald: 'from-emerald-400/16 to-transparent',
    white: 'from-white/12 to-transparent',
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[#111111] p-5">
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 bg-gradient-to-br',
          accentMap[accent],
        )}
      />
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/32">
          {label}
        </p>
        <p className="mt-4 font-serif text-4xl text-white">{value}</p>
        <p className="mt-3 text-sm leading-7 tracking-wide text-white/46">
          {detail}
        </p>
      </div>
    </div>
  );
};

const StatusPill = ({ status, type = 'reservation' }) => {
  const styleMap =
    type === 'reservation' ? reservationStatusStyles : contactStatusStyles;

  return (
    <span
      className={clsx(
        'inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.3em]',
        styleMap[status] ||
          'border-white/10 bg-white/[0.04] text-white/60',
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

const Surface = ({ children, className = '' }) => (
  <div
    className={clsx(
      'rounded-[24px] border border-white/7 bg-[#111111]/95 p-5',
      className,
    )}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value, tone = 'text-white/82' }) => (
  <div className="flex items-start justify-between gap-5 border-b border-white/6 py-4 last:border-b-0">
    <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
      {label}
    </p>
    <p
      className={clsx(
        'max-w-[62%] text-right text-sm leading-7 tracking-wide',
        tone,
      )}
    >
      {value}
    </p>
  </div>
);

const AdminPanel = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reservationDrafts, setReservationDrafts] = useState({});
  const [contactDrafts, setContactDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        setError('');
        const client = createSupabaseAuthedClient(getToken);
        const [reservationData, contactData] = await Promise.all([
          fetchAdminReservations(client),
          fetchAdminContacts(client),
        ]);

        if (!isMounted) {
          return;
        }

        setReservations(reservationData);
        setContacts(contactData);
        setReservationDrafts(
          reservationData.reduce((drafts, reservation) => {
            drafts[reservation.id] = {
              reservation_status: reservation.reservation_status,
              table_number: reservation.table_number || '',
              admin_notes: reservation.admin_notes || '',
            };
            return drafts;
          }, {}),
        );
        setContactDrafts(
          contactData.reduce((drafts, message) => {
            drafts[message.id] = {
              status: message.status,
            };
            return drafts;
          }, {}),
        );
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [getToken]);

  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return {
      totalReservations: reservations.length,
      todayReservations: reservations.filter(
        (reservation) => reservation.reservation_date === today,
      ).length,
      activeService: reservations.filter(
        (reservation) =>
          reservation.reservation_status === 'confirmed' ||
          reservation.reservation_status === 'preparing',
      ).length,
      newContacts: contacts.filter((contact) => contact.status === 'new').length,
      revenueInPreorders: reservations.reduce(
        (sum, reservation) => sum + Number(reservation.subtotal || 0),
        0,
      ),
    };
  }, [contacts, reservations]);

  const orderedReservations = useMemo(() => {
    return [...reservations].sort((first, second) => {
      const statusDelta =
        (reservationPriority[first.reservation_status] ?? 99) -
        (reservationPriority[second.reservation_status] ?? 99);

      if (statusDelta !== 0) {
        return statusDelta;
      }

      return getReservationTimestamp(first) - getReservationTimestamp(second);
    });
  }, [reservations]);

  const orderedContacts = useMemo(() => {
    return [...contacts].sort((first, second) => {
      const statusDelta =
        (contactPriority[first.status] ?? 99) -
        (contactPriority[second.status] ?? 99);

      if (statusDelta !== 0) {
        return statusDelta;
      }

      return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
    });
  }, [contacts]);

  async function saveReservation(reservationId) {
    try {
      setSavingId(reservationId);
      const client = createSupabaseAuthedClient(getToken);
      const updatedReservation = await updateReservationManagement(
        client,
        reservationId,
        reservationDrafts[reservationId],
      );

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === reservationId ? updatedReservation : reservation,
        ),
      );
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingId('');
    }
  }

  async function saveContact(contactId) {
    try {
      setSavingId(contactId);
      const client = createSupabaseAuthedClient(getToken);
      const updatedContact = await updateContactStatus(
        client,
        contactId,
        contactDrafts[contactId].status,
      );

      setContacts((currentContacts) =>
        currentContacts.map((contact) =>
          contact.id === contactId ? updatedContact : contact,
        ),
      );
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingId('');
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <section className="relative px-6 pb-14 pt-32 md:px-10 lg:px-16">
        <div className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[#d4af37]/10 blur-[160px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-[320px] w-[320px] rounded-full bg-white/[0.03] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <Shell className="p-6 md:p-8">
              <SectionHeader
                eyebrow="Operations Dashboard"
                title="A Clear Command Center For Service"
                detail="Monitor reservations, table assignments, guest requests, and inbound contacts from one premium control surface."
              />

              <div className="grid gap-4 md:grid-cols-5">
                <KpiCard
                  label="Total"
                  value={metrics.totalReservations}
                  detail="Reservations in the system"
                  accent="white"
                />
                <KpiCard
                  label="Today"
                  value={metrics.todayReservations}
                  detail="Bookings scheduled today"
                  accent="gold"
                />
                <KpiCard
                  label="Active"
                  value={metrics.activeService}
                  detail="Confirmed or preparing"
                  accent="emerald"
                />
                <KpiCard
                  label="Contacts"
                  value={metrics.newContacts}
                  detail="New guest inquiries"
                  accent="blue"
                />
                <KpiCard
                  label="Pre-Orders"
                  value={formatCurrency(metrics.revenueInPreorders)}
                  detail="Reserved dish revenue"
                  accent="gold"
                />
              </div>
            </Shell>

            <Shell className="p-6 md:p-8">
              <SectionHeader
                eyebrow="Workspace"
                title="Queue Focus"
                detail="Switch between the live booking queue and contact inbox without leaving the operating view."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Surface className="p-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                    Reservation Queue
                  </p>
                  <p className="mt-3 text-sm leading-7 tracking-wide text-white/62">
                    {reservations.length} total reservations ready for service
                    review and table assignment.
                  </p>
                </Surface>
                <Surface className="p-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                    Contact Inbox
                  </p>
                  <p className="mt-3 text-sm leading-7 tracking-wide text-white/62">
                    {contacts.length} messages available for follow-up and
                    workflow updates.
                  </p>
                </Surface>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'inline-flex items-center gap-3 rounded-full border px-5 py-3 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300',
                        isActive
                          ? 'border-[#d4af37]/35 bg-[#d4af37]/10 text-[#d4af37]'
                          : 'border-white/10 text-white/52 hover:text-white',
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={clsx(
                          'rounded-full px-2.5 py-1 text-[9px] tracking-[0.22em]',
                          isActive
                            ? 'bg-[#d4af37]/14 text-[#d4af37]'
                            : 'bg-white/[0.05] text-white/45',
                        )}
                      >
                        {tab.id === 'reservations'
                          ? orderedReservations.length
                          : orderedContacts.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Shell>
          </div>

          {error ? (
            <div className="mt-6 rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <Shell className="p-8 md:p-10">
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#d4af37]" />
              </div>
            </Shell>
          ) : null}

          {!isLoading && activeTab === 'reservations' ? (
            reservations.length === 0 ? (
              <Shell className="p-8 md:p-10">
                <SectionHeader
                  eyebrow="Reservations"
                  title="No Bookings Available"
                  detail="When guests begin reserving tables, they will appear here with pre-order detail, requests, and assignment controls."
                />
              </Shell>
            ) : (
              <Shell className="p-6 md:p-8">
                <SectionHeader
                  eyebrow="Reservations"
                  title="Service Queue"
                  detail="Review each reservation, update table numbers, and keep service notes organized for the floor team."
                />

                <div className="space-y-5">
                  {orderedReservations.map((reservation) => {
                    const draft = reservationDrafts[reservation.id] || {
                      reservation_status: reservation.reservation_status,
                      table_number: reservation.table_number || '',
                      admin_notes: reservation.admin_notes || '',
                    };

                    return (
                      <article
                        key={reservation.id}
                        className="rounded-[28px] border border-white/8 bg-[#111111]/95 p-5 md:p-6"
                      >
                        <div className="flex flex-col gap-5 border-b border-white/8 pb-5 xl:flex-row xl:items-start xl:justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                              Reservation {reservation.confirmation_code}
                            </p>
                            <h3 className="mt-3 font-serif text-3xl uppercase tracking-tight text-white">
                              {reservation.first_name} {reservation.last_name || ''}
                            </h3>
                            <p className="mt-3 text-sm leading-8 tracking-wide text-white/58">
                              {formatReservationDate(reservation.reservation_date)} at{' '}
                              {reservation.reservation_time}
                              <br />
                              {reservation.guest_label} guests |{' '}
                              {getSeatingLabel(reservation.seating)} |{' '}
                              {getExperienceLabel(reservation.experience)}
                              <br />
                              {reservation.email} |{' '}
                              {reservation.phone || 'No phone provided'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <StatusPill
                              status={reservation.reservation_status}
                              type="reservation"
                            />
                            <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/58">
                              Table {reservation.table_number || 'Pending'}
                            </span>
                            <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
                              {formatCurrency(reservation.subtotal)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
                          <div className="space-y-4">
                            <Surface>
                              <p className="text-[10px] uppercase tracking-[0.3em] text-white/34">
                                Reserved Dishes
                              </p>

                              {reservation.reservation_preorders.length === 0 ? (
                                <p className="mt-4 text-sm leading-8 tracking-wide text-white/52">
                                  No dishes were pre-ordered for this reservation.
                                </p>
                              ) : (
                                <div className="mt-4 space-y-3">
                                  {reservation.reservation_preorders.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between gap-4 rounded-[20px] border border-white/7 bg-black/20 px-4 py-4"
                                    >
                                      <div>
                                        <p className="font-serif text-xl text-white">
                                          {item.menu_item_name}
                                        </p>
                                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">
                                          Quantity {item.quantity}
                                        </p>
                                      </div>
                                      <p className="font-serif text-lg text-[#d4af37]">
                                        {formatCurrency(item.unit_price * item.quantity)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Surface>

                            <Surface>
                              <InfoRow
                                label="Submitted"
                                value={formatDateTime(reservation.created_at)}
                              />
                              <InfoRow
                                label="Requests"
                                value={
                                  reservation.special_requests ||
                                  'No special requests'
                                }
                                tone="text-white/66"
                              />
                            </Surface>
                          </div>

                          <Surface>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                              Reservation Controls
                            </p>

                            <div className="mt-5 space-y-5">
                              <div>
                                <label className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                                  Status
                                </label>
                                <select
                                  value={draft.reservation_status}
                                  onChange={(event) =>
                                    setReservationDrafts((currentDrafts) => ({
                                      ...currentDrafts,
                                      [reservation.id]: {
                                        ...draft,
                                        reservation_status: event.target.value,
                                      },
                                    }))
                                  }
                                  className="mt-3 w-full rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none"
                                >
                                  {reservationStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                                  Table Number
                                </label>
                                <input
                                  type="text"
                                  value={draft.table_number}
                                  onChange={(event) =>
                                    setReservationDrafts((currentDrafts) => ({
                                      ...currentDrafts,
                                      [reservation.id]: {
                                        ...draft,
                                        table_number: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="Ex: B12"
                                  className="mt-3 w-full rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-white/25"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                                  Admin Notes
                                </label>
                                <textarea
                                  rows="6"
                                  value={draft.admin_notes}
                                  onChange={(event) =>
                                    setReservationDrafts((currentDrafts) => ({
                                      ...currentDrafts,
                                      [reservation.id]: {
                                        ...draft,
                                        admin_notes: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="Add service detail, VIP note, allergy handoff, or kitchen prep guidance."
                                  className="mt-3 w-full resize-none rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-white/25"
                                />
                              </div>

                              <button
                                onClick={() => saveReservation(reservation.id)}
                                disabled={savingId === reservation.id}
                                className="w-full rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-5 py-4 text-[10px] uppercase tracking-[0.32em] text-[#d4af37] transition-colors duration-300 hover:bg-[#d4af37] hover:text-black disabled:opacity-50"
                              >
                                {savingId === reservation.id
                                  ? 'Saving Reservation...'
                                  : 'Save Reservation'}
                              </button>
                            </div>
                          </Surface>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </Shell>
            )
          ) : null}

          {!isLoading && activeTab === 'contacts' ? (
            contacts.length === 0 ? (
              <Shell className="p-8 md:p-10">
                <SectionHeader
                  eyebrow="Contacts"
                  title="Inbox Is Empty"
                  detail="When guests submit the contact form, their messages will appear here with status controls for follow-up and resolution."
                />
              </Shell>
            ) : (
              <Shell className="p-6 md:p-8">
                <SectionHeader
                  eyebrow="Contacts"
                  title="Contact Inbox"
                  detail="Handle guest questions, event requests, and follow-up items from a single organized queue."
                />

                <div className="space-y-5">
                  {orderedContacts.map((contact) => {
                    const draft = contactDrafts[contact.id] || {
                      status: contact.status,
                    };

                    return (
                      <article
                        key={contact.id}
                        className="rounded-[28px] border border-white/8 bg-[#111111]/95 p-5 md:p-6"
                      >
                        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                          <Surface>
                            <div className="flex flex-wrap items-center gap-3">
                              <StatusPill status={contact.status} type="contact" />
                              <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/55">
                                {formatDateTime(contact.created_at)}
                              </span>
                            </div>

                            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                              {contact.subject}
                            </p>
                            <h3 className="mt-3 font-serif text-3xl uppercase tracking-tight text-white">
                              {contact.first_name} {contact.last_name || ''}
                            </h3>

                            <div className="mt-5 space-y-1">
                              <InfoRow label="Email" value={contact.email} />
                              <InfoRow
                                label="Phone"
                                value={contact.phone || 'No phone provided'}
                              />
                            </div>

                            <div className="mt-5 rounded-[20px] border border-white/7 bg-black/20 p-4">
                              <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">
                                Message
                              </p>
                              <p className="mt-4 whitespace-pre-line text-sm leading-8 tracking-wide text-white/62">
                                {contact.message}
                              </p>
                            </div>
                          </Surface>

                          <Surface>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                              Inbox Workflow
                            </p>

                            <div className="mt-5 space-y-5">
                              <div>
                                <label className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                                  Status
                                </label>
                                <select
                                  value={draft.status}
                                  onChange={(event) =>
                                    setContactDrafts((currentDrafts) => ({
                                      ...currentDrafts,
                                      [contact.id]: {
                                        status: event.target.value,
                                      },
                                    }))
                                  }
                                  className="mt-3 w-full rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none"
                                >
                                  {contactStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <Surface className="border-white/7 bg-black/20 p-4">
                                <p className="text-sm leading-8 tracking-wide text-white/58">
                                  Move inquiries from <span className="text-amber-200">new</span> to{' '}
                                  <span className="text-sky-200">in progress</span> while the team is
                                  responding, then mark them{' '}
                                  <span className="text-emerald-200">resolved</span> once the request
                                  has been fully handled.
                                </p>
                              </Surface>

                              <button
                                onClick={() => saveContact(contact.id)}
                                disabled={savingId === contact.id}
                                className="w-full rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-5 py-4 text-[10px] uppercase tracking-[0.32em] text-[#d4af37] transition-colors duration-300 hover:bg-[#d4af37] hover:text-black disabled:opacity-50"
                              >
                                {savingId === contact.id
                                  ? 'Saving Contact...'
                                  : 'Save Contact Status'}
                              </button>
                            </div>
                          </Surface>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </Shell>
            )
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminPanel;

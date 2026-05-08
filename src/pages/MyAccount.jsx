import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Footer from '../components/sections/Footer';
import LoadingScreen from '../components/common/LoadingScreen';
import { createSupabaseAuthedClient } from '../lib/supabase';
import { fetchUserReservations } from '../lib/restaurantApi';
import {
  formatCurrency,
  formatReservationDate,
} from '../lib/formatters';
import { getExperienceLabel, getSeatingLabel } from '../data/restaurant';
import { isReservationStackConfigured } from '../lib/env';

const statusStyles = {
  pending: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  confirmed: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  preparing: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
  completed: 'border-white/10 bg-white/[0.04] text-white/60',
  cancelled: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
};

const panelClasses =
  'rounded-[24px] border border-white/10 bg-[#0a0b0d] shadow-[0_18px_48px_rgba(0,0,0,0.24)]';

function getReservationTimestamp(reservation) {
  return new Date(
    `${reservation.reservation_date}T${reservation.reservation_time}:00`,
  ).getTime();
}

function formatShortDate(value) {
  if (!value) {
    return 'Date pending';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));
}

function formatReservationTime(value) {
  if (!value) {
    return 'Time pending';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(`2000-01-01T${value}:00`));
}

function formatMemberDate(value) {
  if (!value) {
    return 'Recently joined';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getPreOrderItems(reservation) {
  return Array.isArray(reservation?.reservation_preorders)
    ? reservation.reservation_preorders
    : [];
}

function getPreOrderCount(reservation) {
  return getPreOrderItems(reservation).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
}

function getPreOrderValue(reservation) {
  const items = getPreOrderItems(reservation);
  const itemTotal = items.reduce(
    (total, item) =>
      total + Number(item.unit_price || 0) * Number(item.quantity || 0),
    0,
  );

  return itemTotal || Number(reservation?.subtotal || 0);
}

function getInitials(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'OG';
}

function getGuestName(reservation) {
  const name = `${reservation?.first_name || ''} ${
    reservation?.last_name || ''
  }`.trim();

  return name || 'Guest';
}

function buildNoteSummary(reservation) {
  const notes = [];

  if (reservation?.special_requests) {
    notes.push(`Guest: ${reservation.special_requests}`);
  }

  if (reservation?.admin_notes) {
    notes.push(`Team: ${reservation.admin_notes}`);
  }

  return notes.join(' ') || 'No special requests or service notes.';
}

function getPreOrderPreview(items) {
  if (!items.length) {
    return 'No dishes pre-ordered';
  }

  const names = items.slice(0, 2).map((item) => item.menu_item_name);

  if (items.length <= 2) {
    return names.join(' • ');
  }

  return `${names.join(' • ')} +${items.length - 2} more`;
}

const Panel = ({ children, className = '' }) => (
  <section className={clsx(panelClasses, className)}>{children}</section>
);

const Inset = ({ children, className = '' }) => (
  <div
    className={clsx(
      'rounded-[18px] border border-white/8 bg-white/[0.025] p-4 md:p-5',
      className,
    )}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }) => (
  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c8a75e]">
    {children}
  </p>
);

const StatusBadge = ({ status }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em]',
      statusStyles[status] || 'border-white/10 bg-white/[0.04] text-white/60',
    )}
  >
    {status}
  </span>
);

const SoftPill = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'border-white/8 bg-white/[0.03] text-white/65',
    accent: 'border-[#c8a75e]/20 bg-[#c8a75e]/10 text-[#e3c981]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em]',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
};

const MetricTile = ({ label, value, detail }) => (
  <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
    <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
      {label}
    </p>
    <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
      {value}
    </p>
    <p className="mt-2 text-sm leading-6 text-white/50">{detail}</p>
  </div>
);

const SummaryTile = ({ label, value, detail }) => (
  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
    <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
      {label}
    </p>
    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white">
      {value}
    </p>
    {detail ? <p className="mt-1 text-sm text-white/46">{detail}</p> : null}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-5 border-b border-white/8 py-3 last:border-b-0 last:pb-0 first:pt-0">
    <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
      {label}
    </p>
    <p className="max-w-[60%] text-right text-sm leading-6 text-white/76">
      {value}
    </p>
  </div>
);

const NoticeBanner = ({ title, description, tone = 'neutral' }) => {
  const toneStyles = {
    neutral: 'border-white/10 bg-white/[0.03] text-white/80',
    danger: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
  };

  return (
    <div
      className={clsx(
        'rounded-[18px] border px-5 py-4',
        toneStyles[tone],
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm leading-6 text-inherit/80">{description}</p>
    </div>
  );
};

const EmptyWorkspace = () => (
  <div className="space-y-4">
    <div className="rounded-[18px] border border-dashed border-white/12 bg-white/[0.02] p-5">
      <p className="text-base font-semibold tracking-[-0.02em] text-white">
        No upcoming booking
      </p>
      <p className="mt-2 max-w-xl text-sm leading-7 text-white/55">
        Your next reservation will appear here with timing, table assignment,
        service notes, and any dishes reserved with the kitchen.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryTile label="Date" value="Pending" detail="Reserve a table" />
      <SummaryTile label="Time" value="Pending" detail="Select a seating" />
      <SummaryTile label="Party" value="0 guests" detail="Add guest count" />
      <SummaryTile label="Seating" value="Pending" detail="Choose a room" />
      <SummaryTile label="Table" value="Pending" detail="Assigned by team" />
    </div>
  </div>
);

const MyAccount = () => {
  const { getToken, isLoaded, userId } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [error, setError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReservations() {
      if (!isLoaded) {
        return;
      }

      if (!userId || !isReservationStackConfigured) {
        if (isMounted) {
          setReservations([]);
          setError('');
          setIsLoadingReservations(false);
        }
        return;
      }

      try {
        setError('');
        const client = createSupabaseAuthedClient(getToken);
        const data = await fetchUserReservations(client);

        if (isMounted) {
          setReservations(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        console.error('Failed to load reservations for My Account:', loadError);

        if (isMounted) {
          setReservations([]);
          setError(
            'We could not load the latest reservation data right now. The rest of your account is still available.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingReservations(false);
        }
      }
    }

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, [getToken, isLoaded, userId]);

  const displayName =
    user?.fullName || user?.firstName || user?.username || 'Obsidian Guest';

  const viewModel = useMemo(() => {
    const enrichedReservations = reservations.map((reservation) => {
      const preOrderItems = getPreOrderItems(reservation);
      const timestamp = getReservationTimestamp(reservation);

      return {
        ...reservation,
        timestamp,
        shortDate: formatShortDate(reservation.reservation_date),
        fullDate: formatReservationDate(reservation.reservation_date),
        formattedTime: formatReservationTime(reservation.reservation_time),
        tableDisplay: reservation.table_number || 'Pending',
        guestName: getGuestName(reservation),
        partyLabel: `${reservation.guest_label || 0} guests`,
        seatingLabel: getSeatingLabel(reservation.seating),
        experienceLabel: getExperienceLabel(reservation.experience),
        preOrderItems,
        preOrderCount: getPreOrderCount(reservation),
        preOrderValue: getPreOrderValue(reservation),
        preOrderPreview: getPreOrderPreview(preOrderItems),
        noteSummary: buildNoteSummary(reservation),
      };
    });

    const openReservations = enrichedReservations
      .filter(
        (reservation) =>
          reservation.reservation_status !== 'completed' &&
          reservation.reservation_status !== 'cancelled',
      )
      .sort((first, second) => first.timestamp - second.timestamp);

    const closedReservations = enrichedReservations
      .filter(
        (reservation) =>
          reservation.reservation_status === 'completed' ||
          reservation.reservation_status === 'cancelled',
      )
      .sort((first, second) => second.timestamp - first.timestamp);

    const historyRows = [...openReservations, ...closedReservations];
    const latestReservation = historyRows[0] || null;
    const totalSpend = enrichedReservations.reduce(
      (total, reservation) => total + reservation.preOrderValue,
      0,
    );
    const totalPreOrders = enrichedReservations.reduce(
      (total, reservation) => total + reservation.preOrderCount,
      0,
    );
    const confirmedCount = enrichedReservations.filter(
      (reservation) => reservation.reservation_status === 'confirmed',
    ).length;

    return {
      nextReservation: openReservations[0] || null,
      reservationMetrics: {
        totalBookings: enrichedReservations.length,
        confirmed: confirmedCount,
        preOrders: totalPreOrders,
        spend: totalSpend,
      },
      historyRows,
      preorderTotals: {
        items: totalPreOrders,
        value: totalSpend,
      },
      accountProfile: {
        initials: getInitials(displayName),
        displayName,
        email:
          user?.primaryEmailAddress?.emailAddress ||
          latestReservation?.email ||
          'No email on file',
        phone:
          user?.primaryPhoneNumber?.phoneNumber ||
          latestReservation?.phone ||
          'Not added yet',
        memberSince: formatMemberDate(user?.createdAt),
      },
    };
  }, [displayName, reservations, user]);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      await signOut({ redirectUrl: '/' });
    } catch (signOutError) {
      console.error('Failed to sign out from My Account:', signOutError);
      setIsSigningOut(false);
    }
  }

  if (!isLoaded || isLoadingReservations) {
    return <LoadingScreen label="Loading your account" />;
  }

  const { nextReservation, reservationMetrics, historyRows, accountProfile } =
    viewModel;
  const isConnected = isReservationStackConfigured;

  return (
    <div className="min-h-screen overflow-hidden bg-[#050607] text-white">
      <section className="relative px-6 pb-14 pt-32 md:px-10 lg:px-16">
        <div className="pointer-events-none absolute left-[-80px] top-8 h-[240px] w-[240px] rounded-full bg-[#c8a75e]/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-50px] top-24 h-[180px] w-[180px] rounded-full bg-white/[0.03] blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-white/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Account Workspace</Eyebrow>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                My Account
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                {displayName}, track your next table, pre-orders, and service
                details in one clean workspace built for quick updates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/reservations"
                className="inline-flex items-center justify-center rounded-[14px] border border-[#c8a75e]/25 bg-[#c8a75e]/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[#e3c981] transition-colors duration-300 hover:bg-[#c8a75e] hover:text-black"
              >
                Book Table
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center rounded-[14px] border border-white/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/70 transition-colors duration-300 hover:border-white/25 hover:text-white"
              >
                Browse Menu
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {!isConnected ? (
              <NoticeBanner
                title="Reservation sync is not connected yet"
                description="Your account workspace is ready, but live reservation data will only appear after Clerk and Supabase are fully connected."
              />
            ) : null}

            {error ? (
              <NoticeBanner
                title="Reservation data is temporarily unavailable"
                description={error}
                tone="danger"
              />
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
            <Panel className="p-6 md:p-8">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <Eyebrow>Upcoming Reservation</Eyebrow>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {nextReservation
                      ? `${nextReservation.shortDate} at ${nextReservation.formattedTime}`
                      : 'No upcoming booking'}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/56">
                    {nextReservation
                      ? 'This is the next active reservation on your account, including service notes, seating, and pre-order details.'
                      : 'Once a booking is created, this workspace will show the next table, seating plan, and any dishes reserved in advance.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {nextReservation ? (
                    <>
                      <StatusBadge status={nextReservation.reservation_status} />
                      <SoftPill>Table {nextReservation.tableDisplay}</SoftPill>
                      <SoftPill tone="accent">
                        {nextReservation.confirmation_code}
                      </SoftPill>
                    </>
                  ) : (
                    <SoftPill>Waiting for next booking</SoftPill>
                  )}
                </div>
              </div>

              {nextReservation ? (
                <>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <SummaryTile
                      label="Date"
                      value={nextReservation.shortDate}
                      detail={nextReservation.fullDate}
                    />
                    <SummaryTile
                      label="Time"
                      value={nextReservation.formattedTime}
                      detail="Local dining time"
                    />
                    <SummaryTile
                      label="Party"
                      value={nextReservation.partyLabel}
                      detail={nextReservation.guestName}
                    />
                    <SummaryTile
                      label="Seating"
                      value={nextReservation.seatingLabel}
                      detail={nextReservation.experienceLabel}
                    />
                    <SummaryTile
                      label="Table"
                      value={String(nextReservation.tableDisplay)}
                      detail="Assigned by the host team"
                    />
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                      <Inset>
                        <p className="text-sm font-medium text-white">
                          Reservation details
                        </p>
                        <div className="mt-4">
                          <DetailRow
                            label="Confirmation"
                            value={nextReservation.confirmation_code}
                          />
                          <DetailRow
                            label="Guest"
                            value={nextReservation.guestName}
                          />
                          <DetailRow
                            label="Email"
                            value={nextReservation.email || 'Not provided'}
                          />
                          <DetailRow
                            label="Phone"
                            value={nextReservation.phone || 'Not provided'}
                          />
                          <DetailRow
                            label="Experience"
                            value={nextReservation.experienceLabel}
                          />
                        </div>
                      </Inset>

                      <Inset>
                        <p className="text-sm font-medium text-white">
                          Service notes
                        </p>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                          {nextReservation.noteSummary}
                        </p>
                      </Inset>
                    </div>

                    <Inset>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            Pre-order summary
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                            {formatCurrency(nextReservation.preOrderValue)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/52">
                            {nextReservation.preOrderCount} reserved item
                            {nextReservation.preOrderCount === 1 ? '' : 's'}
                          </p>
                        </div>

                        <SoftPill tone="accent">
                          {nextReservation.preOrderCount} item
                          {nextReservation.preOrderCount === 1 ? '' : 's'}
                        </SoftPill>
                      </div>

                      {nextReservation.preOrderItems.length > 0 ? (
                        <div className="mt-5 space-y-3">
                          {nextReservation.preOrderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 rounded-[14px] border border-white/8 bg-black/20 px-4 py-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                  {item.menu_item_name}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">
                                  Quantity {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-[#e3c981]">
                                {formatCurrency(
                                  Number(item.unit_price || 0) *
                                    Number(item.quantity || 0),
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-5 text-sm leading-7 text-white/56">
                          No dishes have been pre-ordered for this reservation
                          yet.
                        </p>
                      )}
                    </Inset>
                  </div>
                </>
              ) : (
                <div className="mt-6">
                  <EmptyWorkspace />
                </div>
              )}
            </Panel>

            <div className="space-y-6">
              <Panel className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.04] text-sm font-semibold tracking-[0.2em] text-white">
                      {accountProfile.initials}
                    </div>
                    <div className="min-w-0">
                      <Eyebrow>Account Snapshot</Eyebrow>
                      <h2 className="mt-3 truncate text-2xl font-semibold tracking-[-0.03em] text-white">
                        {accountProfile.displayName}
                      </h2>
                      <p className="mt-2 break-all text-sm leading-6 text-white/55">
                        {accountProfile.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="inline-flex shrink-0 items-center justify-center rounded-[14px] border border-white/10 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-white/60 transition-colors duration-300 hover:border-white/24 hover:text-white disabled:cursor-not-allowed disabled:border-white/8 disabled:text-white/28"
                  >
                    {isSigningOut ? 'Signing Out' : 'Log Out'}
                  </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MetricTile
                    label="Bookings"
                    value={reservationMetrics.totalBookings}
                    detail="Reservations on this account"
                  />
                  <MetricTile
                    label="Confirmed"
                    value={reservationMetrics.confirmed}
                    detail="Approved by the restaurant"
                  />
                  <MetricTile
                    label="Pre-orders"
                    value={reservationMetrics.preOrders}
                    detail="Reserved dishes total"
                  />
                  <MetricTile
                    label="Spend"
                    value={formatCurrency(reservationMetrics.spend)}
                    detail="Reserved dish value"
                  />
                </div>

                <div className="mt-6">
                  <DetailRow label="Phone" value={accountProfile.phone} />
                  <DetailRow
                    label="Member since"
                    value={accountProfile.memberSince}
                  />
                  <DetailRow
                    label="Open bookings"
                    value={String(
                      historyRows.filter(
                        (reservation) =>
                          reservation.reservation_status !== 'completed' &&
                          reservation.reservation_status !== 'cancelled',
                      ).length,
                    )}
                  />
                </div>
              </Panel>

              <Panel className="p-6">
                <Eyebrow>Dining Support</Eyebrow>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  Need help with a booking?
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  Use the contact form for reservation changes, special dining
                  requests, or updates that should be seen by the restaurant
                  team.
                </p>

                <div className="mt-5 space-y-3">
                  <Inset className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                      Fastest route
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Contact the dining team and reference your confirmation
                      code for faster changes.
                    </p>
                  </Inset>
                  <Inset className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                      Best for
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Table changes, allergies, celebrations, and reservation
                      follow-ups.
                    </p>
                  </Inset>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-[14px] border border-[#c8a75e]/25 bg-[#c8a75e]/10 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#e3c981] transition-colors duration-300 hover:bg-[#c8a75e] hover:text-black"
                  >
                    Contact Team
                  </Link>
                  <Link
                    to="/reservations"
                    className="inline-flex items-center justify-center rounded-[14px] border border-white/10 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:border-white/25 hover:text-white"
                  >
                    Reserve Again
                  </Link>
                </div>
              </Panel>
            </div>
          </div>

          <Panel className="mt-6 p-6 md:p-8">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Reservation History</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                  Booking ledger
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/56">
                  Review upcoming reservations, past services, confirmation
                  codes, and dish pre-orders from one clean record.
                </p>
              </div>

              <SoftPill>
                {historyRows.length} reservation
                {historyRows.length === 1 ? '' : 's'}
              </SoftPill>
            </div>

            {historyRows.length === 0 ? (
              <div className="mt-6 rounded-[18px] border border-dashed border-white/12 bg-white/[0.02] p-6 md:p-8">
                <p className="text-lg font-semibold tracking-[-0.02em] text-white">
                  No reservation history yet
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/56">
                  When bookings are added, this ledger will show reservation
                  timing, confirmation codes, table assignments, and dish
                  pre-orders without cluttering the page.
                </p>
                <Link
                  to="/reservations"
                  className="mt-5 inline-flex items-center justify-center rounded-[14px] border border-[#c8a75e]/25 bg-[#c8a75e]/10 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#e3c981] transition-colors duration-300 hover:bg-[#c8a75e] hover:text-black"
                >
                  Reserve A Table
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {historyRows.map((reservation) => (
                  <article
                    key={reservation.id}
                    className="rounded-[20px] border border-white/8 bg-white/[0.02] p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#c8a75e]">
                          {reservation.reservation_status === 'completed' ||
                          reservation.reservation_status === 'cancelled'
                            ? 'Past reservation'
                            : 'Active reservation'}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                          {reservation.shortDate} at {reservation.formattedTime}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-white/56">
                          {reservation.partyLabel} • {reservation.seatingLabel}{' '}
                          • {reservation.experienceLabel}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={reservation.reservation_status} />
                        <SoftPill>Table {reservation.tableDisplay}</SoftPill>
                        <SoftPill tone="accent">
                          {formatCurrency(reservation.preOrderValue)}
                        </SoftPill>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px]">
                      <Inset>
                        <p className="text-sm font-medium text-white">
                          Guest and booking
                        </p>
                        <p className="mt-3 text-sm leading-7 text-white/70">
                          {reservation.guestName}
                        </p>
                        <p className="text-sm leading-7 text-white/56">
                          {reservation.email || 'No email provided'}
                        </p>
                        <p className="text-sm leading-7 text-white/56">
                          {reservation.phone || 'No phone provided'}
                        </p>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/38">
                          Confirmation {reservation.confirmation_code}
                        </p>
                      </Inset>

                      <Inset>
                        <p className="text-sm font-medium text-white">
                          Pre-order and service notes
                        </p>
                        <p className="mt-3 text-sm leading-7 text-white/70">
                          {reservation.preOrderPreview}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-white/56">
                          {reservation.noteSummary}
                        </p>
                      </Inset>

                      <Inset>
                        <p className="text-sm font-medium text-white">
                          Summary
                        </p>
                        <div className="mt-4 space-y-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                              Reserved items
                            </p>
                            <p className="mt-1 text-sm text-white/76">
                              {reservation.preOrderCount} item
                              {reservation.preOrderCount === 1 ? '' : 's'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                              Reserved value
                            </p>
                            <p className="mt-1 text-sm text-white/76">
                              {formatCurrency(reservation.preOrderValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">
                              Full date
                            </p>
                            <p className="mt-1 text-sm text-white/76">
                              {reservation.fullDate}
                            </p>
                          </div>
                        </div>
                      </Inset>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyAccount;

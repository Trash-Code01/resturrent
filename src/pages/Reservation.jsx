import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/sections/Footer';
import LoadingScreen from '../components/common/LoadingScreen';
import PageNotice from '../components/common/PageNotice';
import { isReservationStackConfigured } from '../lib/env';
import { submitReservation } from '../lib/restaurantApi';
import { createSupabaseAuthedClient } from '../lib/supabase';

const timeSlots = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

const seatingOptions = [
  {
    id: 'main_dining',
    label: 'Main Dining Room',
    desc: 'The vibrant heart of Obsidian.',
  },
  {
    id: 'chefs_counter',
    label: "Chef's Counter",
    desc: 'An immersive culinary performance.',
  },
  {
    id: 'private_booth',
    label: 'Private Booth',
    desc: 'Intimate seating with curtains.',
  },
];

const experienceOptions = [
  {
    id: 'a_la_carte',
    label: 'A La Carte',
    price: 'Varies',
    desc: 'Select from our seasonal menu upon arrival.',
  },
  {
    id: 'tasting_menu',
    label: 'The Signature Tasting',
    price: '$250/pp',
    desc: 'A curated 9-course journey through our finest creations.',
  },
  {
    id: 'wine_pairing',
    label: 'Tasting + Wine Pairing',
    price: '$395/pp',
    desc: 'The tasting menu perfectly paired with sommelier selections.',
  },
];

const menuItems = [
  {
    id: 'm1',
    name: 'Truffle Caviar Pasta',
    price: 120,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055106/ChatGPT_Image_May_5_2026_09_50_18_PM-Photoroom_og2hx2.png',
  },
  {
    id: 'm2',
    name: 'Wagyu Tomahawk',
    price: 210,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_1_-Photoroom_cfnjii.png',
  },
  {
    id: 'm3',
    name: 'Gold Leaf Lobster',
    price: 185,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_4_-Photoroom_wy0w0p.png',
  },
  {
    id: 'm4',
    name: 'Black Cod Miso',
    price: 145,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055106/ChatGPT_Image_May_5_2026_09_50_18_PM-Photoroom_og2hx2.png',
  },
  {
    id: 'm5',
    name: "Duck Breast a l'Orange",
    price: 150,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_1_-Photoroom_cfnjii.png',
  },
  {
    id: 'm6',
    name: 'Chocolate Gold Lava Cake',
    price: 65,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_4_-Photoroom_wy0w0p.png',
  },
];

function getLocalDateString() {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
}

function formatReservationDate(dateString) {
  if (!dateString) {
    return 'Not selected';
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function createReservationFormState(user = null) {
  return {
    date: getLocalDateString(),
    time: '',
    guests: '2',
    seating: 'main_dining',
    experience: 'a_la_carte',
    preOrders: {},
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.primaryPhoneNumber?.phoneNumber || '',
    specialRequests: '',
  };
}

const Reservation = () => {
  const containerRef = useRef(null);
  const hasStepMountedRef = useRef(false);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState(() => createReservationFormState());
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewConfirmed, setIsReviewConfirmed] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const confirmationCode = searchParams.get('confirmed');
  const isConfirmationView = Boolean(confirmationCode);

  useEffect(() => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      date: currentFormData.date || getLocalDateString(),
    }));
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      firstName: currentFormData.firstName || user.firstName || '',
      lastName: currentFormData.lastName || user.lastName || '',
      email:
        currentFormData.email ||
        user.primaryEmailAddress?.emailAddress ||
        '',
      phone: currentFormData.phone || user.primaryPhoneNumber?.phoneNumber || '',
    }));
  }, [isLoaded, user]);

  useEffect(() => {
    if (confirmationCode && !confirmation) {
      setConfirmation({ confirmation_code: confirmationCode });
      return;
    }

    if (!confirmationCode && confirmation) {
      setConfirmation(null);
    }
  }, [confirmation, confirmationCode]);

  useEffect(() => {
    if (!hasStepMountedRef.current) {
      hasStepMountedRef.current = true;
      return;
    }

    const target = containerRef.current;
    if (!target) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [step, isConfirmationView]);

  const selectedPreOrders = useMemo(() => {
    return menuItems
      .map((item) => ({
        ...item,
        quantity: formData.preOrders[item.id] || 0,
      }))
      .filter((item) => item.quantity > 0);
  }, [formData.preOrders]);

  const subtotal = selectedPreOrders.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const selectedSeating = seatingOptions.find(
    (option) => option.id === formData.seating,
  );
  const selectedExperience = experienceOptions.find(
    (option) => option.id === formData.experience,
  );

  if (!isReservationStackConfigured) {
    return (
      <PageNotice
        title="Reservations Need Clerk And Supabase Connected"
        description="The reservation UI is ready, but live booking needs your Clerk publishable key, Supabase URL, and Supabase anon key. If you are using Clerk's newer Supabase integration, make sure the Supabase-side Clerk provider is finished too."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen label="Loading reservations" />;
  }

  const updateForm = (field, value) => {
    setIsReviewConfirmed(false);
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  };

  const updatePreOrder = (id, change) => {
    setIsReviewConfirmed(false);
    setFormData((currentFormData) => {
      const currentQty = currentFormData.preOrders[id] || 0;
      const nextQty = Math.max(0, currentQty + change);
      const nextOrders = { ...currentFormData.preOrders };

      if (nextQty === 0) {
        delete nextOrders[id];
      } else {
        nextOrders[id] = nextQty;
      }

      return {
        ...currentFormData,
        preOrders: nextOrders,
      };
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let index = 0; index < firstDay; index += 1) {
      days.push(<div key={`empty-${index}`} className="h-12 md:h-16" />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      const dateString = localDate.toISOString().split('T')[0];
      const isSelected = formData.date === dateString;

      days.push(
        <button
          key={day}
          type="button"
          disabled={isPast}
          onClick={() => updateForm('date', dateString)}
          className={`flex h-12 items-center justify-center font-serif text-lg transition-all duration-300 md:h-16 md:text-xl ${
            isPast
              ? 'cursor-not-allowed text-white/10'
              : isSelected
                ? 'z-10 scale-[1.15] border border-gold-500 bg-gold-500/10 text-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : 'border border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.02] hover:text-white'
          }`}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    const today = new Date();
    if (
      currentMonth.getFullYear() > today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() > today.getMonth())
    ) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
      );
    }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1 && (!formData.date || !formData.time)) {
      return 'Please choose both a date and a time before continuing.';
    }

    return '';
  };

  const handleNext = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsReviewConfirmed(false);
    setStep((currentStep) => Math.min(currentStep + 1, 3));
  };

  const handlePrev = () => {
    setError('');
    setIsReviewConfirmed(false);
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const resetReservationFlow = () => {
    setSearchParams({}, { replace: true });
    setConfirmation(null);
    setError('');
    setIsReviewConfirmed(false);
    setStep(1);
    setCurrentMonth(new Date());
    setFormData(createReservationFormState(user));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step !== 3) {
      setError('Finish the reservation review step before placing the booking.');
      return;
    }

    const validationError = validateStep(1);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isReviewConfirmed) {
      setError('Review the reservation summary and confirm the checkbox before placing your booking.');
      return;
    }

    if (!isSignedIn) {
      setError('Please sign in before confirming your reservation.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const client = createSupabaseAuthedClient(getToken);
      const reservation = await submitReservation(client, {
        ...formData,
        preorders: selectedPreOrders,
      });

      setConfirmation(reservation);
      setSearchParams(
        { confirmed: reservation.confirmation_code },
        { replace: true },
      );
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#030303] text-white"
      ref={containerRef}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-0 top-0 h-[800px] w-[800px] rounded-full bg-gold-900/5 blur-[200px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gold-500/5 blur-[200px]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col justify-center px-6 pb-24 pt-32 lg:px-16">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] font-sans uppercase tracking-[0.4em] text-gold-500 md:text-xs">
            Obsidian Reservations
          </p>
          <h1 className="mb-4 font-serif text-5xl uppercase leading-none tracking-tighter md:text-7xl">
            Secure Your{' '}
            <span className="pr-2 font-light italic text-gold-500">
              Table
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-sm font-light tracking-widest text-white/40">
            {isConfirmationView
              ? 'Reservation Confirmed'
              : `Step 0${step} of 03`}
          </p>
        </div>

        {!isConfirmationView && (
          <div className="relative mx-auto mb-16 h-px w-full max-w-3xl bg-white/10">
            <div
              className="absolute left-0 top-0 h-full bg-gold-500 transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`mx-auto w-full transition-all duration-500 ${
            !isConfirmationView && step === 3 ? 'max-w-5xl' : 'max-w-3xl'
          }`}
        >
          {!isConfirmationView && step === 1 && (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
              <div className="space-y-6 lg:col-span-7">
                <label className="mb-6 block text-xs font-sans uppercase tracking-[0.2em] text-white/40">
                  Select Date
                </label>
                <div className="relative overflow-hidden border border-white/5 bg-[#0a0a0a] p-6 md:p-8">
                  <div className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-full -translate-x-1/2 bg-gold-500/5 blur-[50px]" />

                  <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/10 pb-6">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-2 text-white/30 transition-colors hover:text-gold-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h3 className="font-serif text-xl uppercase tracking-[0.1em] text-white md:text-2xl">
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-2 text-white/30 transition-colors hover:text-gold-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="relative z-10">
                    <div className="mb-4 grid grid-cols-7">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-[9px] uppercase tracking-[0.3em] text-white/30"
                          >
                            {day}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2">
                      {renderCalendar()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12 lg:col-span-5">
                <div className="space-y-6">
                  <label className="block text-xs font-sans uppercase tracking-[0.2em] text-white/40">
                    Number of Guests
                  </label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateForm('guests', num.toString())}
                        className={`flex h-14 items-center justify-center border font-serif text-xl transition-all duration-300 ${
                          formData.guests === num.toString()
                            ? 'scale-[1.05] border-gold-500 bg-gold-500/10 text-gold-400'
                            : 'border-white/10 text-white/60 hover:border-white/40 hover:bg-white/[0.02]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateForm('guests', '7+')}
                      className={`col-span-3 flex h-14 items-center justify-center border text-[9px] font-sans uppercase tracking-[0.2em] transition-all duration-300 sm:col-span-2 ${
                        formData.guests === '7+'
                          ? 'scale-[1.05] border-gold-500 bg-gold-500/10 text-gold-400'
                          : 'border-white/10 text-white/60 hover:border-white/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      Larger Party
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-xs font-sans uppercase tracking-[0.2em] text-white/40">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => updateForm('time', time)}
                        className={`border py-3 text-xs font-sans tracking-[0.15em] transition-all duration-300 ${
                          formData.time === time
                            ? 'scale-[1.05] border-gold-500 bg-gold-500/10 text-gold-400'
                            : 'border-white/10 text-white/60 hover:border-white/40 hover:bg-white/[0.02]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isConfirmationView && step === 2 && (
            <div className="space-y-12">
              <div className="space-y-6">
                <label className="mb-6 block text-xs font-sans uppercase tracking-[0.2em] text-white/40">
                  Seating Preference
                </label>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {seatingOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateForm('seating', option.id)}
                      className={`flex min-h-[140px] cursor-pointer flex-col justify-between border p-6 text-left transition-all duration-500 ${
                        formData.seating === option.id
                          ? 'border-gold-500 bg-gold-500/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <h4
                        className={`mb-2 font-serif text-lg ${
                          formData.seating === option.id
                            ? 'text-gold-400'
                            : 'text-white'
                        }`}
                      >
                        {option.label}
                      </h4>
                      <p className="text-xs leading-relaxed text-white/40">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="mb-6 block text-xs font-sans uppercase tracking-[0.2em] text-white/40">
                  Dining Experience
                </label>
                <div className="space-y-4">
                  {experienceOptions.map((experience) => (
                    <button
                      key={experience.id}
                      type="button"
                      onClick={() => updateForm('experience', experience.id)}
                      className={`group flex w-full cursor-pointer items-center justify-between border p-6 text-left transition-all duration-500 ${
                        formData.experience === experience.id
                          ? 'border-gold-500 bg-gold-500/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <h4
                          className={`mb-1 font-serif text-xl ${
                            formData.experience === experience.id
                              ? 'text-gold-400'
                              : 'text-white'
                          }`}
                        >
                          {experience.label}
                        </h4>
                        <p className="text-sm text-white/40">
                          {experience.desc}
                        </p>
                      </div>
                      <div className="pl-4 text-right">
                        <span className="font-serif text-white/70">
                          {experience.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isConfirmationView && step === 3 && (
            <div className="space-y-8">
              <div className="mb-12 text-center">
                <label className="mb-3 block text-xs font-sans uppercase tracking-[0.2em] text-white/70">
                  Review And Finalize
                </label>
                <p className="text-sm font-light text-white/50">
                  Add optional pre-orders, leave service notes, and review your
                  reservation before placing it.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                {menuItems.map((item) => {
                  const qty = formData.preOrders[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      className={`group flex min-h-[120px] items-center justify-between border bg-[#0a0a0a] p-5 transition-all duration-500 lg:min-h-[140px] lg:p-6 ${
                        qty > 0
                          ? 'border-gold-500'
                          : 'border-gold-500/20 hover:border-gold-500/50'
                      }`}
                    >
                      <div className="flex w-full items-center gap-5">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-500/10 bg-[#050505] p-2 shadow-inner lg:h-20 lg:w-20">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`h-full w-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out ${
                              qty > 0
                                ? 'scale-95'
                                : 'scale-[1.15] group-hover:scale-95'
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1 pr-2">
                          <h4
                            className={`mb-1 font-serif text-lg leading-tight lg:text-xl ${
                              qty > 0 ? 'text-gold-400' : 'text-white'
                            }`}
                          >
                            {item.name}
                          </h4>
                          <p className="font-serif text-sm text-white/60 lg:text-base">
                            ${item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 items-center justify-between gap-3 rounded-full border border-white/20 bg-black/60 px-3 py-1.5">
                        <button
                          type="button"
                          onClick={() => updatePreOrder(item.id, -1)}
                          className="flex h-6 w-6 items-center justify-center p-1 text-3xl font-light leading-none text-white/60 transition-colors hover:text-gold-400 lg:h-8 lg:w-8"
                        >
                          -
                        </button>
                        <span className="min-w-[2ch] text-center font-serif text-lg text-white lg:text-xl">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updatePreOrder(item.id, 1)}
                          className="flex h-6 w-6 items-center justify-center p-1 text-3xl font-light leading-none text-white/60 transition-colors hover:text-gold-400 lg:h-8 lg:w-8"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-16 flex items-end justify-between border-t border-white/10 pt-8">
                <div className="space-y-2">
                  <span className="block text-[10px] font-sans uppercase tracking-[0.4em] text-white/70">
                    Estimated Subtotal
                  </span>
                  <span className="text-xs italic text-white/50">
                    Exclusive of taxes & gratuity
                  </span>
                </div>
                <span className="font-serif text-4xl text-white md:text-5xl">
                  ${subtotal}
                </span>
              </div>

              <div className="grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div className="space-y-3">
                  <label className="block text-[10px] font-sans uppercase tracking-[0.32em] text-white/55">
                    Special Requests / Allergies
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(event) =>
                      updateForm('specialRequests', event.target.value)
                    }
                    rows="4"
                    placeholder="Add any dietary notes, allergies, celebration details, or service requests for your table."
                    className="w-full resize-none border border-white/10 bg-[#0a0a0a] px-5 py-4 font-serif text-base leading-8 text-white transition-colors placeholder:text-white/20 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="border border-white/10 bg-[#0a0a0a] px-5 py-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500">
                    Reservation Summary
                  </p>
                  <div className="mt-5 space-y-4 text-sm text-white/72">
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Date
                      </span>
                      <span className="text-right">
                        {formatReservationDate(formData.date)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Time
                      </span>
                      <span className="text-right">
                        {formData.time || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Guests
                      </span>
                      <span className="text-right">{formData.guests}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Seating
                      </span>
                      <span className="text-right">
                        {selectedSeating?.label || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Experience
                      </span>
                      <span className="text-right">
                        {selectedExperience?.label || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Pre-orders
                      </span>
                      <span className="text-right">
                        {selectedPreOrders.length > 0
                          ? `${selectedPreOrders.length} selected`
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 pt-1 font-serif text-lg text-white">
                      <span className="uppercase tracking-[0.18em] text-white/35">
                        Subtotal
                      </span>
                      <span className="text-right">${subtotal}</span>
                    </div>
                  </div>

                  <label className="mt-6 flex items-start gap-3 border-t border-white/8 pt-5 text-sm leading-7 text-white/62">
                    <input
                      type="checkbox"
                      checked={isReviewConfirmed}
                      onChange={(event) =>
                        setIsReviewConfirmed(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#d4af37]"
                    />
                    <span>
                      I have reviewed these reservation details and I want to
                      place this booking.
                    </span>
                  </label>

                  <p className="mt-4 text-xs leading-6 text-white/38">
                    {isSignedIn
                      ? 'Your signed-in account details will be used when this reservation is placed.'
                      : 'Sign in is required before you can place this reservation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isConfirmationView && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10">
                <svg
                  className="h-10 w-10 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-6 font-serif text-4xl text-white">
                We look forward to hosting you.
              </h3>
              <p className="mx-auto mb-4 max-w-md font-sans leading-relaxed tracking-wide text-white/40">
                Your reservation has been created and is now linked to your
                account.
              </p>
              {confirmation?.confirmation_code ? (
                <p className="mx-auto mb-12 max-w-md text-[11px] uppercase tracking-[0.35em] text-gold-500">
                  Confirmation {confirmation.confirmation_code}
                </p>
              ) : null}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={resetReservationFlow}
                  className="border border-gold-500/40 px-10 py-4 text-xs uppercase tracking-[0.3em] text-gold-500 transition-colors hover:bg-gold-500/10"
                >
                  Reserve Another
                </button>
                <Link
                  to="/my-account"
                  className="border border-gold-500/40 px-10 py-4 text-xs uppercase tracking-[0.3em] text-gold-500 transition-colors hover:bg-gold-500/10"
                >
                  View My Account
                </Link>
                <Link
                  to="/"
                  className="border border-white/20 px-10 py-4 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:border-gold-500 hover:text-gold-500"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}

          {!isConfirmationView && error ? (
            <div className="mt-10 border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {!isConfirmationView && (
            <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-10">
              <button
                type="button"
                onClick={handlePrev}
                className={`text-xs font-sans uppercase tracking-[0.3em] transition-colors ${
                  step === 1
                    ? 'pointer-events-none opacity-0'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Go Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && (!formData.date || !formData.time)}
                  className="border border-gold-500/40 px-10 py-4 text-xs uppercase tracking-[0.3em] text-gold-500 transition-colors hover:bg-gold-500/10 disabled:pointer-events-none disabled:opacity-30"
                >
                  Continue
                </button>
              ) : isSignedIn ? (
                <button
                  type="submit"
                  disabled={isSubmitting || !isReviewConfirmed}
                  className="relative flex min-w-[200px] items-center justify-center bg-gold-500 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-black transition-colors hover:bg-gold-400 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  ) : (
                    'Place Reservation'
                  )}
                </button>
                ) : (
                  <Link
                    to="/sign-in?redirect=%2Freservations"
                    className="inline-flex border border-gold-500/40 px-10 py-4 text-xs uppercase tracking-[0.3em] text-gold-500 transition-colors hover:bg-gold-500/10"
                  >
                    Login To Confirm
                  </Link>
                )}
              </div>
            )}
        </form>
      </div>

      {isConfirmationView && <Footer />}
    </div>
  );
};

export default Reservation;

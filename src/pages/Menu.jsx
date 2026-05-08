import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['signatures', 'mains', 'desserts', 'cocktails'];

const MENU = {
  signatures: {
    label: "Chef's Signatures",
    shortLabel: 'Signatures',
    mobileTab: 'Signatures',
    number: '01',
    subtitle: 'The pinnacle of our craft, composed for those who seek the extraordinary.',
    items: [
      {
        id: 1,
        name: 'Truffle Caviar Pasta',
        desc: 'Creamy handmade pasta with black caviar, shaved truffle, parmesan dust, and herb oil.',
        price: '$120',
        img: '/asset/ChatGPT Image May 5, 2026, 09_50_18 PM-Photoroom.png',
      },
      {
        id: 2,
        name: 'Wagyu Tomahawk',
        desc: 'A5-style wagyu tomahawk with smoked sea salt, rosemary jus, roasted garlic, and gold-finished plating.',
        price: '$210',
        img: '/asset/our story/ChatGPT Image May 6, 2026, 05_35_50 PM-Photoroom.png',
      },
      {
        id: 3,
        name: 'Gold Leaf Lobster',
        desc: 'Butter-poached lobster tail with saffron cream, caviar, edible gold leaf, and citrus zest.',
        price: '$185',
        img: '/asset/our story/ChatGPT Image May 6, 2026, 05_52_41 PM (2)-Photoroom.png',
      },
    ],
  },
  mains: {
    label: 'Mains',
    shortLabel: 'Mains',
    mobileTab: 'Mains',
    number: '02',
    subtitle: 'Masterfully composed plates, each one a study in restraint and intensity.',
    items: [
      {
        id: 4,
        name: 'Black Cod Miso',
        desc: 'Charcoal-glazed black cod with bok choy, sesame, yuzu glaze, and spring onion.',
        price: '$145',
        img: '/asset/our story/ChatGPT Image May 6, 2026, 05_43_53 PM (3)-Photoroom.png',
      },
      {
        id: 5,
        name: "Duck Breast a l'Orange",
        desc: 'Crispy duck breast with orange glaze, citrus segments, thyme, and golden sauce pearls.',
        price: '$150',
        img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (3)-Photoroom.png',
      },
      {
        id: 6,
        name: 'Lamb Rack Royale',
        desc: 'Herb-crusted lamb rack with potato puree, red wine jus, rosemary salt, and micro herbs.',
        price: '$170',
        img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (1)-Photoroom.png',
      },
    ],
  },
  desserts: {
    label: 'Desserts',
    shortLabel: 'Desserts',
    mobileTab: 'Desserts',
    number: '03',
    subtitle: 'Sweet conclusions that feel delicate, gilded, and worthy of the evening.',
    items: [
      {
        id: 7,
        name: 'Chocolate Gold Lava Cake',
        desc: 'Molten chocolate cake with vanilla ice cream, berries, cocoa dust, and edible gold.',
        price: '$65',
        img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (2)-Photoroom.png',
      },
      {
        id: 8,
        name: 'Pistachio Rose Mille-Feuille',
        desc: 'Crisp pastry layers with pistachio cream, rose petals, powdered sugar, and gold flakes.',
        price: '$58',
        img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (3)-Photoroom.png',
      },
      {
        id: 9,
        name: 'Vanilla Caviar Creme Brulee',
        desc: 'Vanilla bean creme brulee with caramelized sugar, golden pearls, and delicate sugar crystals.',
        price: '$55',
        img: '/asset/our story/ChatGPT Image May 6, 2026, 05_35_50 PM-Photoroom.png',
      },
    ],
  },
  cocktails: {
    label: 'Cocktails',
    shortLabel: 'Drinks',
    mobileTab: 'Drinks',
    number: '04',
    subtitle: 'Liquid poetry, each cocktail an extension of the Obsidian philosophy.',
    items: [
      {
        id: 10,
        name: 'Obsidian Old Fashioned',
        desc: 'A smoky amber old fashioned with orange peel, crystal ice sphere, bitters, and gold-rimmed glass.',
        price: '$42',
        img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (5)-Photoroom.png',
      },
      {
        id: 11,
        name: 'Vintage Negroni',
        desc: 'Deep red negroni with dried citrus, bitter orange, herbal finish, and gold cocktail pin.',
        price: '$38',
        img: '/asset/ChatGPT Image May 6, 2026, 01_21_55 PM-Photoroom.png',
      },
      {
        id: 12,
        name: 'Golden Martini',
        desc: 'Clear golden martini with lemon twist, olive, chilled glass, and refined botanical notes.',
        price: '$40',
        img: '/asset/our story/ChatGPT Image May 8, 2026, 04_28_58 AM-Photoroom.png',
      },
    ],
  },
};

const MOBILE_HIGHLIGHTS = ['Swipe menu', 'Chef curated', '12 icons'];

const SignatureCard = ({ item, index }) => {
  const isReversed = index % 2 !== 0;
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    let localSpin;
    let localFloat;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );

      const entryTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          localSpin = gsap.fromTo(
            img,
            { rotation: -15 },
            {
              rotation: 15,
              duration: 20,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              transformOrigin: '50% 50%',
            },
          );
          localFloat = gsap.to(img, {
            y: '-=12',
            duration: 3.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        },
      });

      entryTl.fromTo(
        img,
        { y: -80, opacity: 0, scale: 0.85, rotation: -25 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 2.4, ease: 'power3.out' },
      );

      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        onEnter: () => entryTl.play(),
        onLeaveBack: () => {
          if (localSpin) localSpin.kill();
          if (localFloat) localFloat.kill();
          entryTl.reverse();
        },
      });
    }, el);

    return () => {
      if (localSpin) localSpin.kill();
      if (localFloat) localFloat.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-20 py-12 md:py-16 border-b border-white/5 last:border-0`}
    >
      <span className="absolute top-4 right-4 font-serif text-[5rem] md:text-[8rem] leading-none text-white/[0.03] select-none pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative w-full md:w-1/2 flex items-center justify-center py-4 md:py-8">
        <img
          ref={imgRef}
          src={item.img}
          alt={item.name}
          className="relative z-10 w-56 md:w-80 xl:w-96 h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
        />
      </div>

      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="h-px w-8 bg-gold-500/50" />
          <span className="text-gold-500/70 font-serif italic text-[10px] md:text-xs tracking-[0.35em] uppercase">
            {String(index + 1).padStart(2, '0')} / Signature
          </span>
        </div>
        <h3 className="font-serif text-white text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight leading-none mb-3 md:mb-5 group-hover:text-amber-50 transition-colors duration-500 break-words">
          {item.name}
        </h3>
        <p className="text-white/40 font-sans text-xs md:text-base leading-relaxed mb-6 md:mb-8 max-w-sm tracking-wide">
          {item.desc}
        </p>
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6">
          <span className="font-serif text-gold-400 text-xl md:text-2xl tracking-wide">{item.price}</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                window.location.href = '/reservations';
              }, 300);
            }}
            className="group/btn relative px-6 md:px-8 py-3 border border-white/15 text-white text-[9px] uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:border-gold-500/50"
          >
            <span className="relative z-10">Reserve Now</span>
            <div className="absolute inset-0 bg-gold-950/70 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-600 ease-out" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuRow = ({ item, index }) => {
  const rowRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        delay: index * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      },
    );
  }, [index]);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex items-center justify-between gap-4 md:gap-6 py-5 md:py-7 border-b transition-all duration-300 cursor-default ${hovered ? 'border-gold-500/20' : 'border-white/5'}`}
    >
      <span
        className={`font-serif italic text-[10px] md:text-xs tracking-[0.3em] flex-shrink-0 w-6 md:w-8 transition-colors duration-400 ${hovered ? 'text-white' : 'text-white/15'}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {item.img && (
        <div className="hidden md:flex w-24 h-24 items-center justify-center flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <img
            src={item.img}
            alt={item.name}
            className="max-w-full max-h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 pr-4 md:pr-0">
        <h4
          className={`font-serif uppercase tracking-wide leading-none text-base md:text-2xl mb-1 transition-colors duration-400 ${hovered ? 'text-amber-50' : 'text-white'}`}
        >
          {item.name}
        </h4>
        <p
          className={`font-sans text-[11px] md:text-sm leading-relaxed max-w-lg tracking-wide mt-1.5 md:mt-0 transition-all duration-400 ${hovered ? 'text-white/60 md:max-h-24 opacity-100' : 'text-white/40 md:text-white/25 max-h-24 md:max-h-0 opacity-100 md:opacity-0 md:overflow-hidden'}`}
        >
          {item.desc}
        </p>
      </div>

      <div className="hidden lg:flex flex-1 items-center mx-4">
        <div className={`h-px flex-1 transition-all duration-500 ${hovered ? 'bg-gold-500/30' : 'bg-white/5'}`} />
      </div>

      <span className={`font-serif text-sm md:text-xl flex-shrink-0 transition-colors duration-300 ${hovered ? 'text-gold-400' : 'text-white/60'}`}>
        {item.price}
      </span>
    </div>
  );
};

const MobileSignatureFeature = ({ item, index }) => (
  <article className="relative flex flex-col items-center gap-7">
    <div className="absolute right-0 top-[18%] select-none font-serif text-[4.8rem] leading-none text-white/[0.035] pointer-events-none">
      {String(index + 1).padStart(2, '0')}
    </div>

    <div className="relative w-full px-4">
      <div className="relative mx-auto flex aspect-square max-w-[280px] items-center justify-center">
        <div
          className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/6 blur-[60px]"
        />
        <div className="relative z-10 h-full w-full p-4">
          <img
            src={item.img}
            alt={item.name}
            className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
          />
        </div>
      </div>
    </div>

    <div className="relative z-10 w-full px-6 text-center">
      <div className="mb-6 inline-flex w-full items-center justify-center gap-4">
        <div className="h-px w-8 bg-gold-500/40" />
        <p className="font-serif text-xl italic tracking-wide text-gold-500">{item.price}</p>
      </div>

      <h3 className="mb-6 font-serif text-3xl font-medium leading-[1.08] tracking-tight text-white">
        {item.name}
      </h3>

      <p className="mx-auto mb-8 max-w-sm font-sans text-base font-light leading-relaxed tracking-wide text-white/80">
        {item.desc}
      </p>

      <button className="hidden group relative overflow-hidden border border-white/20 px-10 py-4 text-center text-[10px] font-light uppercase tracking-[0.3em] text-white transition-all duration-700 hover:border-gold-500/50">
        <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Discover Dish</span>
        <div className="absolute inset-0 origin-left scale-x-0 bg-gold-950/80 transition-transform duration-700 ease-out group-hover:scale-x-100" />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gold-500/30" />
      </button>
    </div>
  </article>
);

const MobileGalleryMenuRow = ({ item, index, sectionLabel }) => {
  const isReversed = index % 2 !== 0;

  const imagePanel = (
    <div className="relative h-full min-h-[220px] overflow-hidden border border-white/[0.06] bg-black">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: 'radial-gradient(circle at 50% 38%, rgba(212,175,55,0.1) 0%, transparent 62%)' }}
      />
      <span className="absolute right-3 top-3 font-serif text-[11px] italic tracking-[0.3em] text-white/18">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <img
          src={item.img}
          alt={item.name}
          className="h-full w-full object-contain drop-shadow-[0_24px_38px_rgba(0,0,0,0.92)]"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <div className="mb-3 h-px w-8 bg-gold-500/35" />
        <p
          className="font-serif text-[0.82rem] uppercase leading-none tracking-[0.1em] text-white"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.name}
        </p>
      </div>
    </div>
  );

  const detailPanel = (
    <div
      className="relative flex h-full min-h-[220px] flex-col justify-between border p-3.5"
      style={{
        background: 'linear-gradient(140deg, #131210 0%, #0c0c0a 100%)',
        borderColor: 'rgba(212,175,55,0.10)',
      }}
    >
      <div
        className="absolute right-2 bottom-1 font-serif text-[4.4rem] leading-none pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.03)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-5 bg-gold-500/45" />
          <span className="font-serif text-[8px] italic uppercase tracking-[0.24em] text-gold-400/65">
            {sectionLabel} Selection
          </span>
        </div>

        <h3
          className="font-serif text-[1.22rem] uppercase leading-[0.9] tracking-tight text-white"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.name}
        </h3>

        <p
          className="mt-3 text-[10px] leading-[1.65] tracking-[0.02em] text-white/42"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.desc}
        </p>
      </div>

      <div className="relative z-10">
        <span className="font-serif text-[1.7rem] tracking-wide text-gold-400">{item.price}</span>
      </div>
    </div>
  );

  return (
    <article className="grid grid-cols-2 items-stretch gap-3">
      <div className={isReversed ? 'order-2' : 'order-1'}>{imagePanel}</div>
      <div className={isReversed ? 'order-1' : 'order-2'}>{detailPanel}</div>
    </article>
  );
};

const MenuSection = ({ category }) => {
  const data = MENU[category];
  const titleRef = useRef(null);
  const isSignatures = category === 'signatures';

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      },
    );
  }, []);

  return (
    <section id={`menu-${category}`} className="relative w-full scroll-mt-40 overflow-hidden py-16 md:scroll-mt-36 md:py-36">
      <div ref={titleRef} className="container mx-auto px-6 lg:px-16">
        {isSignatures ? (
          <div className="md:hidden max-w-[320px] text-left">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold-500/50" />
              <span className="font-serif text-[10px] italic uppercase tracking-[0.4em] text-gold-500/70">{data.number}</span>
              <div className="h-px w-8 bg-gold-500/25" />
            </div>
            <h2 className="mt-5 font-serif text-[2.45rem] uppercase leading-[0.92] tracking-tight text-white">
              <span className="block">Chef&apos;s</span>
              <span className="mt-1 block font-light italic text-gold-400">Signatures</span>
            </h2>
            <p className="mt-5 max-w-[25ch] text-[13px] leading-7 tracking-wide text-white/50">
              {data.subtitle}
            </p>
          </div>
        ) : (
          <div className="md:hidden max-w-[320px] text-left">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold-500/50" />
              <span className="font-serif text-[10px] italic uppercase tracking-[0.4em] text-gold-500/70">{data.number}</span>
            </div>
            <h2 className="mt-4 font-serif text-[2.45rem] uppercase leading-[0.92] tracking-tight text-white">
              {data.label}
            </h2>
            <p className="mt-4 max-w-[26ch] text-[13px] leading-7 tracking-wide text-white/50">
              {data.subtitle}
            </p>
          </div>
        )}

        <div className="hidden md:block mb-12 md:mb-24">
          <div className="flex items-center gap-4 mb-4 md:mb-5">
            <div className="h-px w-8 md:w-10 bg-gold-500/50" />
            <span className="text-gold-500/60 font-serif italic text-[10px] md:text-xs tracking-[0.4em] uppercase">
              {data.number}
            </span>
          </div>
          <div className="relative">

            <h2 className="font-serif text-white uppercase text-3xl sm:text-4xl md:text-6xl xl:text-8xl tracking-tight leading-none mb-3 md:mb-4 relative z-10 pt-4 md:pt-0 break-words w-full">
              {data.label}
            </h2>
          </div>
          <p className="text-white/30 font-sans text-xs md:text-base max-w-xl leading-relaxed tracking-wide mt-3 md:mt-4">
            {data.subtitle}
          </p>
        </div>
      </div>

      <div className="hidden md:block container mx-auto px-6 lg:px-16 mb-8 md:mb-12">
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.3), transparent)' }}
        />
      </div>

      {isSignatures ? (
        <div className="md:hidden container mx-auto mt-10 px-6">
          <div className="flex flex-col gap-16">
            {data.items.map((item, index) => (
              <MobileSignatureFeature key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="md:hidden container mx-auto mt-8 px-6">
          <div className="flex flex-col gap-3">
            {data.items.map((item, index) => (
              <MobileGalleryMenuRow
                key={item.id}
                item={item}
                index={index}
                sectionLabel={data.label}
              />
            ))}
          </div>
        </div>
      )}

      <div className="hidden md:block container mx-auto px-6 lg:px-16">
        {isSignatures ? (
          <div>
            {data.items.map((item, index) => (
              <SignatureCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div>
            {data.items.map((item, index) => (
              <MenuRow key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState('signatures');
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const el = document.getElementById(hash);
      if (!el) return;

      setTimeout(() => {
        const offset = window.innerWidth < 768 ? 152 : 140;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        if (hash.startsWith('menu-')) {
          setActiveTab(hash.replace('menu-', ''));
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  useLayoutEffect(() => {
    const sectionTriggers = [];
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.set('.hero-letter, .hero-sub, .hero-img', { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
      } else {
        gsap.fromTo(
          '.hero-letter',
          { y: 60, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.06,
            ease: 'expo.out',
            delay: 0.2,
            clearProps: 'opacity,transform,filter',
          },
        );

        gsap.fromTo(
          '.hero-sub',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            delay: 0.9,
            clearProps: 'opacity,transform',
          },
        );
      }

      const heroImg = heroRef.current?.querySelector('.hero-img');
      if (heroImg && !isMobile) {
        gsap.fromTo(
          heroImg,
          { y: -80, opacity: 0, scale: 0.85, rotation: -25 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 2.4,
            ease: 'power3.out',
            delay: 0.5,
            onComplete: () => {
              gsap.fromTo(
                heroImg,
                { rotation: -15 },
                {
                  rotation: 15,
                  duration: 20,
                  ease: 'sine.inOut',
                  yoyo: true,
                  repeat: -1,
                  transformOrigin: '50% 50%',
                },
              );
              gsap.to(heroImg, {
                y: '-=12',
                duration: 3.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
              });
            },
          },
        );
      }

      CATEGORIES.forEach((category) => {
        const section = document.getElementById(`menu-${category}`);
        if (!section) return;

        sectionTriggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => setActiveTab(category),
            onEnterBack: () => setActiveTab(category),
          }),
        );
      });
    }, heroRef);

    return () => {
      sectionTriggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, []);

  const scrollToSection = (category) => {
    setActiveTab(category);

    const el = document.getElementById(`menu-${category}`);
    if (!el) return;

    const offset = window.innerWidth < 768 ? 152 : 140;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen max-w-[100vw] overflow-x-hidden pb-[calc(7.5rem+env(safe-area-inset-bottom))] text-white md:pb-0">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section ref={heroRef} className="relative w-full overflow-hidden bg-black md:min-h-screen md:flex md:items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-0 h-[400px] w-[400px] rounded-full blur-[150px] md:h-[700px] md:w-[700px] md:blur-[250px]"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full blur-[120px] md:h-[500px] md:w-[500px] md:blur-[200px]"
            style={{ background: 'radial-gradient(circle, rgba(180,120,20,0.05) 0%, transparent 70%)' }}
          />
        </div>

        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.5) 80px, rgba(255,255,255,0.5) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.5) 80px, rgba(255,255,255,0.5) 81px)',
          }}
        />

        <div className="container relative z-10 mx-auto px-5 pt-24 pb-10 sm:px-6 md:px-6 md:pt-28 md:pb-20 lg:px-16">
          <div className="grid grid-cols-1 gap-8 md:min-h-[85vh] md:items-center md:gap-16 lg:grid-cols-2">
            <div className="order-1 max-w-[340px] md:max-w-none lg:order-1">
              <div className="hero-sub flex items-center gap-3 mb-6 md:mb-10">
                <div className="h-px w-8 md:w-10 bg-gold-500/60" />
                <span className="text-gold-500/70 font-serif italic text-[10px] md:text-xs tracking-[0.5em] uppercase">
                  Obsidian Signature
                </span>
              </div>

              <div className="overflow-hidden mb-4 md:mb-6">
                <h1 className="font-serif uppercase text-white leading-[0.88] tracking-tight text-[3.3rem] sm:text-[4.6rem] md:text-[9rem] xl:text-[11rem] flex flex-wrap">
                  {'Menu'.split('').map((letter, index) => (
                    <span key={index} className="hero-letter inline-block">
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>

              <p className="hero-sub max-w-sm text-white/40 font-sans text-[13px] italic leading-7 tracking-wide mb-6 md:mb-12 md:max-w-md md:text-lg md:leading-relaxed">
                "A curated journey of fire, gold, caviar, smoke, and elegance."
              </p>

              <div className="hero-sub flex flex-wrap gap-2 md:hidden mb-6">
                {MOBILE_HIGHLIGHTS.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[8px] uppercase tracking-[0.24em] text-white/55"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="hero-sub flex items-center gap-4 md:hidden">
                <div className="h-px w-8 bg-white/15" />
                <span className="text-white/25 text-[8px] uppercase tracking-[0.3em] font-sans">
                  Swipe and browse
                </span>
              </div>

              <div className="hero-sub hidden md:flex items-center gap-4">
                <div className="h-px w-10 md:w-16 bg-white/15" />
                <span className="text-white/25 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-sans">
                  Explore
                </span>
              </div>
            </div>

            <div className="relative order-2 flex items-center justify-center pt-1 md:pt-0 lg:order-2">
              <div
                className="absolute inset-0 rounded-full blur-[80px] md:blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%)' }}
              />
              <div className="absolute inset-x-0 top-3 bottom-3 rounded-[30px] border border-white/6 bg-white/[0.02] md:hidden" />
              <img
                className="hero-img relative z-10 w-full max-w-[215px] object-contain drop-shadow-[0_34px_54px_rgba(0,0,0,0.95)] md:max-w-lg md:drop-shadow-[0_60px_100px_rgba(0,0,0,0.95)]"
                src="/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (1)-Photoroom.png"
                alt="Signature Dish"
              />
              <div className="absolute top-4 right-4 h-12 w-12 border-t border-r border-gold-500/30 pointer-events-none md:top-8 md:right-8 md:h-16 md:w-16" />
              <div className="absolute bottom-4 left-4 h-12 w-12 border-b border-l border-gold-500/30 pointer-events-none md:bottom-8 md:left-8 md:h-16 md:w-16" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none md:h-32" />
      </section>

      <div className="sticky top-[72px] md:top-[80px] z-40 border-y border-white/5 bg-black/92 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 lg:px-16">
          <div className="md:hidden py-3">
            <div className="grid grid-cols-4 gap-1 rounded-[22px] border border-white/8 bg-white/[0.03] p-1">
              {CATEGORIES.map((category) => {
                const isActive = activeTab === category;
                return (
                  <button
                    key={category}
                    onClick={() => scrollToSection(category)}
                    className={`min-w-0 rounded-[18px] px-2 py-3 text-[8px] uppercase tracking-[0.16em] whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-gold-500/15 text-gold-400 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)]' : 'text-white/40'}`}
                  >
                    {MENU[category].mobileTab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-1 pt-1">
            {CATEGORIES.map((category) => {
              const isActive = activeTab === category;
              return (
                <button
                  key={category}
                  onClick={() => scrollToSection(category)}
                  className={`relative px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.35em] font-sans whitespace-nowrap transition-all duration-300 flex-shrink-0 ${isActive ? 'text-gold-400 font-medium' : 'text-white/40 hover:text-white/80'}`}
                >
                  {MENU[category].label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute left-[50%] top-0 bottom-0 hidden w-px pointer-events-none xl:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.04), transparent)' }}
        />

        {CATEGORIES.map((category) => (
          <div key={category}>
            <MenuSection category={category} />
            {category !== 'cocktails' && (
              <div className="hidden md:block container mx-auto px-6 lg:px-16">
                <div className="h-px w-full bg-white/[0.04]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="relative w-full overflow-hidden border-t border-white/5 py-24 md:py-60">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/asset/our story/image 1.png"
            alt="Obsidian Atmosphere"
            className="relative -top-[10%] h-[120%] w-full object-cover brightness-[0.35] contrast-[1.2]"
            onError={(event) => {
              event.target.src = '/asset/restaurant-bg.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center px-6 text-center">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#d4af37]/60 md:w-24" />
            <span className="text-[#d4af37] font-sans text-[9px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase">
              Join the Experience
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#d4af37]/60 md:w-24" />
          </div>

          <h2 className="font-serif text-white uppercase text-4xl tracking-tight leading-[0.9] mb-4 drop-shadow-2xl md:text-7xl lg:text-[7rem] md:mb-6">
            Reserve <br />
            <span className="italic text-[#d4af37] font-light lowercase text-5xl md:text-8xl lg:text-[8rem]">
              a table
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-xs text-white/50 font-sans text-xs uppercase tracking-[0.24em] leading-relaxed font-light drop-shadow-md md:mb-14 md:max-w-lg md:text-base">
            Step out of the ordinary. Immerse yourself in culinary excellence.
          </p>

          <button
            onClick={(event) => {
              event.preventDefault();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                window.location.href = '/reservations';
              }, 300);
            }}
            className="group relative w-[80%] max-w-[280px] overflow-hidden border border-[#d4af37]/50 bg-black/30 px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.28em] text-[#d4af37] backdrop-blur-md transition-all duration-700 hover:border-[#d4af37] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] active:scale-[0.95] md:w-auto md:max-w-none md:px-14 md:py-5 md:text-xs md:tracking-[0.3em]"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Book Your Evening</span>
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-[#d4af37] transition-transform duration-700 ease-out group-hover:scale-y-100" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;

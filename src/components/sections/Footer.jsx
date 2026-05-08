import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[16px] w-[16px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const EXPLORE_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Private Events', to: '/reservations' },
  { label: 'The Chef', to: '/story' },
  { label: 'Reservations', to: '/reservations' },
];

const CONTACT_LINKS = [
  { label: '+1 (212) 555-0199', href: 'tel:+12125550199' },
  { label: 'reservations@obsidian.nyc', href: 'mailto:reservations@obsidian.nyc' },
  { label: 'press@obsidian.nyc', href: 'mailto:press@obsidian.nyc' },
];

const FooterSectionHeading = ({ title }) => (
  <h4 className="mb-5 flex items-center gap-3 text-[10px] font-sans uppercase tracking-[0.28em] text-gold-500/60 md:mb-8 md:gap-4 md:text-xs md:tracking-[0.3em]">
    <span className="h-px w-4 bg-gold-500/40"></span>
    {title}
  </h4>
);

const Footer = () => {
  const footerRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Developed by Devacia Agency';

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      if (!isDeleting && index <= fullText.length) {
        setTypedText(fullText.substring(0, index));
        index += 1;
        timeoutId = setTimeout(type, 100);
      } else if (isDeleting && index >= 0) {
        setTypedText(fullText.substring(0, index));
        index -= 1;
        timeoutId = setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        timeoutId = setTimeout(type, isDeleting ? 3000 : 500);
      }
    };

    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-anim', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
      });

      gsap.from('.footer-logo-container', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        delay: 0.2,
      });

      gsap.to('.footer-logo-fill', {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      gsap.fromTo(
        '.footer-bg',
        { y: -100 },
        {
          y: 0,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-40 w-full overflow-hidden border-t border-white/10 bg-[#050505] pt-20 pb-[calc(8.5rem+env(safe-area-inset-bottom))] text-white md:pt-32 md:pb-12"
    >
      <div className="footer-bg pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-1/2 h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[90px] md:h-[500px] md:w-[1000px] md:blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-16">
        <div className="mb-14 lg:grid lg:grid-cols-4 lg:gap-12 md:mb-24">
          <div className="footer-anim pb-8 md:pb-10 lg:col-span-1 lg:pb-0">
            <h2 className="mb-4 font-serif text-[2rem] uppercase tracking-[0.18em] text-white md:mb-6 md:text-3xl">
              OBSIDIAN
            </h2>
            <p className="mb-6 max-w-sm text-[13px] leading-7 tracking-wide text-white/40 md:mb-8 md:text-sm md:leading-relaxed">
              Where shadow meets flavor. Redefining the boundaries of fine dining in the heart of New York City.
            </p>
            <div className="mt-2 flex gap-3 md:gap-6">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 transition-all duration-500 hover:border-gold-500/50 md:h-12 md:w-12"
                >
                  <span className="relative z-10 text-white/50 transition-colors duration-500 group-hover:text-gold-400">
                    {social.icon}
                  </span>
                  <div className="absolute inset-0 scale-0 rounded-full bg-gold-950/40 transition-transform duration-500 ease-out group-hover:scale-100" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-8 md:grid-cols-3 md:gap-x-10 md:gap-y-12 md:pt-10 lg:col-span-3 lg:border-t-0 lg:pt-0 lg:pl-8">
            <div className="footer-anim col-span-1">
              <FooterSectionHeading title="Explore" />
              <ul className="space-y-3 md:space-y-4">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                      className="group inline-flex items-center text-[14px] tracking-wide text-white/50 transition-colors duration-300 hover:text-white md:text-sm"
                    >
                      <span className="mr-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:mr-3 group-hover:w-4"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-anim col-span-1">
              <FooterSectionHeading title="Contact" />
              <ul className="space-y-3 text-[13px] tracking-wide text-white/50 md:space-y-4 md:text-sm">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="break-words transition-colors duration-300 hover:text-white sm:break-normal">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-anim col-span-2 md:col-span-1">
              <FooterSectionHeading title="Visit" />
              <ul className="space-y-3 text-[13px] tracking-wide text-white/50 md:space-y-4 md:text-sm">
                <li className="leading-7">
                  125 West 55th Street
                  <br />
                  New York, NY 10019
                </li>
                <li className="pt-1 text-xs text-white/30 md:pt-2">Mon-Wed: 5pm - 11pm</li>
                <li className="text-xs text-white/30">Thu-Sat: 5pm - 1am</li>
                <li className="mt-1 text-xs italic text-gold-500/40 md:mt-2">Sun: Closed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-logo-container relative flex w-full items-center justify-center overflow-hidden border-t border-white/5 py-6 md:py-10">
          <h1 className="select-none font-serif text-[20vw] leading-none tracking-tighter text-white/[0.05] pointer-events-none sm:text-[15vw] lg:text-[10.5vw]">
            OBSIDIAN
          </h1>
          <h1
            className="footer-logo-fill pointer-events-none absolute inset-0 flex select-none items-center justify-center font-serif text-[20vw] leading-none tracking-tighter text-gold-500 sm:text-[15vw] lg:text-[10.5vw]"
            style={{ clipPath: 'inset(100% 0 0 0)' }}
          >
            OBSIDIAN
          </h1>
        </div>

        <div className="footer-anim grid grid-cols-1 items-center gap-4 border-t border-white/10 pt-6 text-center font-sans text-[9px] uppercase tracking-[0.24em] text-white/30 md:grid-cols-3 md:gap-6 md:pt-8 md:text-[10px] md:tracking-[0.3em] md:text-left">
          <p>&copy; {new Date().getFullYear()} Obsidian Restaurant.</p>

          <div className="flex min-h-[16px] items-center justify-center font-semibold text-gold-400">
            <a href="https://devacia.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-white">
              {typedText}
              <span className="animate-pulse">|</span>
            </a>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-end md:gap-8">
            <a href="#" className="transition-colors duration-300 hover:text-gold-400">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors duration-300 hover:text-gold-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

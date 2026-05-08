import React, { useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ReservationBanner = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const headlineRef = useRef(null);

  // "An Unforgettable" starts white, scrolls to gold — word by word
  // "Evening" stays white always
  const revealWords = ["An", "Unforgettable"];
  const totalRevealWords = revealWords.length;
  const [activeIndex, setActiveIndex] = useState(-1);

  // Scroll-driven word reveal — exactly like Devacia Text-reveal.jsx
  useEffect(() => {
    const handleScroll = () => {
      if (!headlineRef.current) return;
      const { top, height } = headlineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start revealing as it enters viewport
      const scrollProgress = (windowHeight / 1.3 - top) / (height + windowHeight / 3);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const newActiveIndex = Math.floor(clampedProgress * totalRevealWords);
      setActiveIndex(newActiveIndex);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalRevealWords]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Background Parallax
      gsap.fromTo(bgRef.current,
        { scale: 1.15, y: '-5%' },
        {
          scale: 1,
          y: '5%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // Fade up content blocks sequentially
      gsap.fromTo('.rs-fade-up', 
         { opacity: 0, y: 40 },
         { 
            opacity: 1, 
            y: 0, 
            duration: 1.5, 
            stagger: 0.2,
            ease: "expo.out",
            scrollTrigger: {
               trigger: containerRef.current,
               start: "top 60%",
               toggleActions: "play none none reverse"
            }
         }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="reservations" ref={containerRef} className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-black">
      
      {/* Full-screen Background Image — cinematic */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <img 
            ref={bgRef}
            src="/images/image2.png" 
            alt="Dining Room" 
            className="w-full h-[130%] -top-[15%] relative object-cover opacity-40 filter contrast-[1.15] brightness-[0.7]"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />
         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />
         
         {/* Warm ambient glow */}
         <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-900/8 blur-[180px] rounded-full pointer-events-none" />
      </div>
      
      {/* Foreground Content */}
      <div className="relative z-10 w-full container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row justify-between items-center gap-16 md:gap-24">
        
        {/* Left Side: Massive Typography */}
        <div className="flex flex-col items-start w-full lg:w-3/4">
           
           <div className="rs-fade-up flex items-center gap-6 mb-8 md:mb-16">
               <div className="h-px w-12 md:w-20 bg-gold-500/40" />
               <p className="text-gold-500 tracking-[0.5em] text-[10px] uppercase font-light">
                 Reserve Your Experience
               </p>
           </div>
           
           {/* Main Headline — scroll-driven word-by-word color reveal */}
           <div ref={headlineRef} className="rs-fade-up w-full max-w-[1000px]">
               <h2 className="text-7xl sm:text-8xl md:text-9xl xl:text-[10rem] font-serif tracking-tight leading-[0.95] text-left">
                 {/* "An Unforgettable" — white → gold on scroll, word by word */}
                 {revealWords.map((word, i) => {
                   const isActive = i < activeIndex;
                   return (
                     <span 
                       key={i}
                       className={`inline-block mr-[0.2em] font-medium transition-colors duration-500 ease-out ${
                         isActive ? 'text-gold-500' : 'text-white/30'
                       }`}
                     >
                       {word}
                     </span>
                   );
                 })}
                 <br />
                 {/* "Evening" — stays white always */}
                 <span className="inline-block font-medium text-white">
                   Evening
                 </span>
               </h2>
           </div>

           <div className="rs-fade-up mt-4 sm:mt-2 w-full">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-white/30 tracking-wide font-light">
                  at <span className="text-white pr-2 ml-2 md:ml-4 not-italic font-medium">Obsidian</span>
               </h2>
           </div>
           
           {/* Subline */}
           <p className="rs-fade-up text-white/40 font-light text-sm md:text-base tracking-[0.15em] mt-10 max-w-lg leading-relaxed">
               An evening at Obsidian is more than dinner — it is an immersion. 
               Reserve your seat and surrender to the experience.
           </p>

        </div>

        {/* Right Side: Oversized CTA */}
        <div className="rs-fade-up w-full lg:w-auto flex justify-center lg:justify-end">
            <button 
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  window.location.href = '/reservations';
                }, 300);
              }}
              className="group relative w-44 h-44 md:w-52 md:h-52 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-white uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all duration-700 font-light overflow-hidden hover:border-gold-500/40 flex flex-col items-center justify-center hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                 <span className="group-hover:text-white transition-colors duration-500">Secure</span>
                 <span className="w-6 h-px bg-gold-500/50 group-hover:w-12 transition-all duration-700"></span>
                 <span className="group-hover:text-white transition-colors duration-500">Table</span>
              </div>
              <div className="absolute inset-0 bg-gold-500/10 scale-0 group-hover:scale-150 rounded-full origin-center transition-transform duration-[1000ms] ease-out" />
              
              {/* Circular trace line on hover */}
              <svg className="absolute inset-0 w-full h-full text-gold-500 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="49" fill="transparent" strokeWidth="0.5" stroke="currentColor" strokeDasharray="308" strokeDashoffset="308" className="transition-all duration-[2000ms] ease-out group-hover:[stroke-dashoffset:0] opacity-0 group-hover:opacity-100" />
              </svg>
            </button>
        </div>
        
      </div>
    </section>
  );
};

export default ReservationBanner;

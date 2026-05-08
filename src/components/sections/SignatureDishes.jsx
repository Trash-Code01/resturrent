import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  {
    id: 1,
    name: "Truffle Caviar Pasta",
    desc: "Handmade linguine, aged parmesan, fresh black truffle shavings and premium sturgeon caviar.",
    price: "$85",
    img: "https://res.cloudinary.com/dicb5gkab/image/upload/v1778055106/ChatGPT_Image_May_5_2026_09_50_18_PM-Photoroom_og2hx2.png",
    align: "left"
  },
  {
    id: 2,
    name: "Chocolate Gold Lava Cake",
    desc: "Molten Valrhona chocolate cake with vanilla bean gelato, forest berries, and 24k gold leaf.",
    price: "$65",
    img: "/asset/our story/ChatGPT Image May 6, 2026, 05_52_42 PM (4)-Photoroom.png",
    align: "right"
  },
  {
    id: 3,
    name: "Gold Leaf Lobster",
    desc: "Butter-poached lobster tail wrapped in 24k edible gold with micro-greens and saffron emulsion.",
    price: "$150",
    img: "/asset/our story/ChatGPT Image May 6, 2026, 05_52_41 PM (3)-Photoroom.png",
    align: "left"
  }
];

const sprinkleImages = [
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179715/ChatGPT_Image_May_8_2026_12_03_52_AM-Photoroom_h60ew0.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179715/ChatGPT_Image_May_8_2026_12_03_39_AM-Photoroom_t5wiuk.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179713/ChatGPT_Image_May_8_2026_12_00_15_AM-Photoroom_snymvt.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179712/ChatGPT_Image_May_8_2026_12_02_14_AM-Photoroom_hjckfc.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179711/ChatGPT_Image_May_8_2026_12_01_22_AM-Photoroom_ev4yvp.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179712/ChatGPT_Image_May_8_2026_12_00_04_AM-Photoroom_jm2mmy.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179712/ChatGPT_Image_May_8_2026_12_01_42_AM-Photoroom_ha7afy.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179713/ChatGPT_Image_May_8_2026_12_02_45_AM-Photoroom_xgjust.png",
  "https://res.cloudinary.com/dcf2h1rck/image/upload/q_auto/f_auto/v1778179713/ChatGPT_Image_May_8_2026_12_02_41_AM-Photoroom_meyyyx.png",
];

const sprinklePositions = [
  { top: "5%", left: "4%", width: "130px", rotate: -15, delay: 0.1 },
  { top: "15%", right: "6%", width: "140px", rotate: 25, delay: 0.2 },
  { top: "25%", left: "10%", width: "120px", rotate: 45, delay: 0.3 },
  { top: "28%", right: "-6%", width: "310px", rotate: -35, delay: 0.4 }, // Rosemary positioned on right edge
  { top: "45%", left: "5%", width: "110px", rotate: 10, delay: 0.5 },
  { top: "60%", right: "2%", width: "240px", rotate: 30, delay: 0.6 },
  { top: "75%", left: "10%", width: "140px", rotate: -40, delay: 0.7 },
  { top: "85%", right: "15%", width: "115px", rotate: -10, delay: 0.8 },
  { top: "95%", left: "22%", width: "120px", rotate: 60, delay: 0.9 },
];

const SignatureDishes = ({ isEntered }) => {
  const containerRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const headingRef = useRef(null);
  const dishRefs = useRef([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [150, -350]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [300, -500]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const parallaxValues = [yParallax1, yParallax2, yParallax3];
  // Devacia-style scroll reveal for "Chef's" — characters go white/30 → gold
  const chefChars = "Chef's".split("");
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const { top, height } = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = (windowHeight / 1.3 - top) / (height + windowHeight / 3);
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      setActiveCharIndex(Math.floor(clamped * chefChars.length));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chefChars.length]);

  // Refresh ScrollTrigger when layout is fully established (after Hero appears)
  useEffect(() => {
    if (isEntered) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isEntered]);

  useLayoutEffect(() => {
    // Track all infinite loops so we can kill them if needed
    const spinLoops = [];
    const floatLoops = [];

    let ctx = gsap.context(() => {
      // Title Block Entrance Animation
      gsap.from(sectionTitleRef.current, {
        scrollTrigger: {
          trigger: sectionTitleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 2,
        ease: "power4.out"
      });

      // Dishes Animation
      dishRefs.current.forEach((el, index) => {
        if (!el) return;
        const isLeft = dishes[index].align === 'left';

        const img = el.querySelector('.dish-img');
        const content = el.querySelector('.dish-content');
        const bgNum = el.querySelector('.bg-number');

        if (!img) return;

        let localSpin, localFloat;

        // ─── Step 1: Entry from top, landing upright (0°) ───────────────
        const entryTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            // ─── Step 2: Slow pendulum spin (left to right) ───
            localSpin = gsap.fromTo(img,
              { rotation: -15 },
              {
                rotation: 15,
                duration: 20,          // very slow, elegant sweep
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                transformOrigin: "50% 50%"
              }
            );
            spinLoops.push(localSpin);

            // ─── Step 3: Subtle floating up/down ────────────────────────
            localFloat = gsap.to(img, {
              y: "-=12",
              duration: 3.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1
            });
            floatLoops.push(localFloat);
          }
        });

        entryTl
          .fromTo(img,
            {
              y: -80,                // comes from top
              opacity: 0,
              scale: 0.85,
              rotation: -25          // start slightly tilted left
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,           // smoothly lands perfectly upright (0 degrees)
              duration: 2.4,
              ease: "power3.out"
            }
          );

        ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          onEnter: () => entryTl.play(),
          onLeaveBack: () => {
            if (localSpin) localSpin.kill();
            if (localFloat) localFloat.kill();
            entryTl.reverse();
          }
        });

        // ─── Content Reveal ────────────────────────────────────────────────
        gsap.fromTo(content,
          { x: isLeft ? 70 : -70, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // ─── Background Number Parallax ───────────────────────────────────
        if (bgNum) {
          gsap.to(bgNum, {
            y: -150,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        }

        // ─── Typewriter Reveal ────────────────────────────────────────────
        const words = el.querySelectorAll('.typewriter-word');
        gsap.fromTo(words,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.01,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => {
      spinLoops.forEach(t => t.kill());
      floatLoops.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section id="signature-dishes" ref={containerRef} className="relative w-full bg-black py-40 overflow-hidden select-none">

      {/* Background NYC / Ambient Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gold-900/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-neutral-900/30 rounded-full blur-[200px]" />
      </div>

      {/* Spice Sprinkles */}
      {sprinkleImages.map((src, idx) => {
         const pos = sprinklePositions[idx];
         if (!pos) return null;
         const yVal = parallaxValues[idx % parallaxValues.length];
         
         // Only show mint leaves and rose petals for the first dish on mobile (indices 1 and 2)
         const isMobileVisible = idx === 1 || idx === 2;
         
         return (
           <motion.div
             key={`outer-${idx}`}
             className={`absolute pointer-events-none z-0 ${isMobileVisible ? '' : 'hidden md:block'}`}
             style={{
               top: pos.top,
               bottom: pos.bottom,
               left: pos.left,
               right: pos.right,
               width: pos.width,
               y: yVal
             }}
           >
             <motion.div
               initial={{ opacity: 0, scale: 0.5 }}
               whileInView={{ opacity: 0.85, scale: 1 }}
               viewport={{ once: false, margin: "-100px" }}
               animate={{
                 y: [0, -20, 0],
                 rotate: [pos.rotate, pos.rotate + 10, pos.rotate]
               }}
               transition={{
                 duration: 4 + (idx % 3),
                 repeat: Infinity,
                 repeatType: "reverse",
                 ease: "easeInOut",
                 opacity: { duration: 1, delay: pos.delay },
                 scale: { duration: 1, delay: pos.delay }
               }}
               style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))' }}
             >
               <img src={src} alt="ingredient" className="w-full h-auto object-contain" />
             </motion.div>
           </motion.div>
         );
      })}

      <div className="container mx-auto px-6 relative z-10">
        <div ref={sectionTitleRef} className="text-center mb-56">
          <p className="text-gold-500/60 font-serif text-sm italic tracking-[0.2em] mb-4">
            Curated Artisanal Cuisine
          </p>
          <h2 ref={headingRef} className="text-5xl md:text-[7rem] font-serif uppercase leading-[0.9] tracking-tight">
            <span className="inline-block whitespace-nowrap">
              {chefChars.map((char, idx) => (
                <span
                  key={idx}
                  className={`inline-block transition-colors duration-500 ease-out ${idx < activeCharIndex ? 'text-gold-500' : 'text-white/30'
                    }`}
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="italic font-light text-white ml-4">
              Signatures
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-32 md:gap-64 lg:gap-96">
          {dishes.map((dish, i) => (
            <div
              key={dish.id}
              ref={el => dishRefs.current[i] = el}
              className={`relative flex flex-col items-center gap-10 md:gap-16 lg:gap-32 ${dish.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              {/* Elegant Luxury Numbering */}
              <div className={`bg-number absolute top-[-5%] md:top-[-10%] ${dish.align === 'left' ? 'left-0 md:left-[-5%]' : 'right-0 md:right-[-5%]'} pointer-events-none z-0 opacity-[0.07]`}>
                <span className="text-[35vw] md:text-[20vw] font-serif font-extralight text-white leading-none">
                  0{i + 1}
                </span>
              </div>

              {/* Image Side - Cinematic Framing */}
              <div className="relative w-full md:w-1/2 z-10 px-4 md:px-0">
                <div className="relative aspect-square max-w-[280px] md:max-w-xl mx-auto flex items-center justify-center">
                  {/* Luxury Glow */}
                  <div className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] md:h-[15rem] md:w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/6 blur-[60px] md:blur-[90px]" />

                  <div className="relative w-full h-full p-4 md:p-8">
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className="dish-img w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] md:drop-shadow-[0_40px_60px_rgba(0,0,0,0.95)] z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Text Side - Tailored Typography */}
              <div className="dish-content w-full md:w-1/2 lg:w-1/3 z-10 text-center md:text-left px-6 md:px-0">
                <div className="inline-flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-8 w-full">
                  <div className="h-px w-8 bg-gold-500/40" />
                  <p className="text-gold-500 font-serif text-xl md:text-2xl italic tracking-wide">{dish.price}</p>
                </div>

                <h4 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white mb-6 md:mb-10 tracking-tight leading-[1.1] md:leading-[1] font-medium">
                  {dish.name}
                </h4>

                <p className="text-white/80 font-light text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-12 max-w-sm mx-auto md:mx-0 font-sans tracking-wide">
                  {dish.desc.split(" ").map((word, idx) => (
                    <span key={idx} className="typewriter-word inline-block mr-[0.25em]">{word}</span>
                  ))}
                </p>

                <motion.a
                  href="/menu#menu-signatures"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="inline-block text-center group relative px-10 md:px-14 py-4 bg-transparent border border-white/20 text-white uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[9px] transition-all duration-700 font-light overflow-hidden hover:border-gold-500/50"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">Discover Dish</span>
                  <div className="absolute inset-0 bg-gold-950/80 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-500/30" />
                </motion.a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureDishes;

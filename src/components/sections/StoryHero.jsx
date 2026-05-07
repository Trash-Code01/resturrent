import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StoryHero = () => {
  const paragraphText =
    'Obsidian is a tribute to contrast where elemental fire meets precious gold, and silence elevates every detail. In the heart of New York, we craft unforgettable experiences for those who seek the exceptional.';

  const characters = paragraphText.split('');

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-black">
      <div className="absolute inset-0 h-full w-full">
        <img src="/asset/our story/image.png" alt="Obsidian Dining Room" className="h-full w-full object-cover opacity-50 scale-105" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.88) 100%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
      </div>

      <div className="container relative z-10 mx-auto px-5 pt-24 sm:px-6 md:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-2 overflow-hidden">
            <motion.h3
              initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="font-serif text-base uppercase tracking-[0.28em] text-[#d4af37] md:text-2xl"
            >
              The Story Of
            </motion.h3>
          </div>

          <div className="mb-7 flex w-full justify-center md:mb-8">
            <h1 className="flex flex-wrap items-center justify-center font-serif text-[3.25rem] font-light leading-[0.88] tracking-[0.12em] text-white sm:text-[4.5rem] md:text-[8rem] lg:text-[9rem] xl:text-[10rem]">
              {'OBSIDIAN'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 1.6,
                    delay: 0.4 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
            className="mb-7 h-px w-20 origin-center bg-gold-500/60 md:mb-8 md:w-24"
            style={{ backgroundColor: '#d4af37' }}
          />

          <div className="mb-6 overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
              className="font-serif text-lg uppercase leading-snug tracking-[0.22em] text-[#d4af37] md:text-3xl"
            >
              A Legacy of Fire, Gold,
              <br />
              and Silence.
            </motion.h2>
          </div>

          <div className="mb-10 min-h-[96px] max-w-2xl md:mb-12">
            <motion.p className="text-sm leading-7 tracking-wide text-white/60 md:text-base md:leading-loose">
              {characters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: 2 + index * 0.015 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 4.5, ease: 'easeOut' }}
            className="flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row sm:gap-6"
          >
            <Link
              to="/reservations"
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              className="group relative flex items-center justify-center overflow-hidden px-8 py-4 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#c69c3a' }}
            >
              <div className="absolute inset-0 origin-center scale-x-0 bg-white/20 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.2em] text-black">Reserve A Table</span>
            </Link>

            <Link
              to="/menu"
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              className="group relative flex items-center justify-center overflow-hidden border border-white/30 px-8 py-4 transition-all duration-500 hover:scale-[1.02] hover:border-white/60 active:scale-[0.98]"
            >
              <div className="absolute inset-0 origin-center scale-x-0 bg-white/5 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 text-xs uppercase tracking-[0.2em] text-white transition-colors duration-500">Explore Menu</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoryHero;

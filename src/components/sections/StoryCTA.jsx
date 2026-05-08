import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StoryCTA = () => {
  return (
    <section className="relative flex h-[420px] w-full items-center justify-center overflow-hidden border-t border-white/[0.05] bg-black md:h-[600px]">
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          src="/asset/our story/image.png"
          alt="Obsidian Atmosphere"
          onError={(event) => {
            event.target.src = '/asset/restaurant-bg.jpg';
          }}
          className="h-full w-full object-cover object-center opacity-[0.35] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] justify-center px-5 text-center sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center rounded-[28px] border border-white/8 bg-black/30 px-6 py-10 backdrop-blur-[2px] md:rounded-none md:border-transparent md:bg-transparent md:px-0 md:py-0"
        >
          <div className="mb-7 h-px w-12 bg-[#d4af37] md:mb-8" />

          <h2 className="mb-5 font-serif text-[2rem] uppercase leading-[1.06] tracking-[0.16em] text-[#e6d5b8] md:mb-6 md:text-[42px] lg:text-[50px]">
            Become Part of
            <br className="hidden md:block" /> the Story
          </h2>

          <p className="mb-8 text-[13px] uppercase tracking-[0.22em] text-white/60 md:mb-12 md:text-[18px] md:tracking-[0.15em]">
            Reserve your table and experience Obsidian.
          </p>

          <Link
            to="/reservations"
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="group relative flex w-[85%] max-w-[280px] items-center justify-center overflow-hidden border border-[#d4af37]/50 bg-[#050505]/50 px-6 py-3.5 backdrop-blur-sm transition-all duration-700 hover:border-[#d4af37] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-[0.95] md:w-auto md:max-w-none md:px-14 md:py-5"
          >
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-[#d4af37] transition-transform duration-500 ease-out group-hover:scale-y-100" />
            <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4af37] transition-colors duration-500 group-hover:text-black md:text-[13px]">
              Reserve A Table
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StoryCTA;

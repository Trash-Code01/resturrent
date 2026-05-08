import React from 'react';
import { motion } from 'framer-motion';

const StoryVision = () => {
  return (
    <section className="relative w-full border-t border-white/[0.05] bg-black py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-stretch px-4 md:flex-row md:px-8">
        <div className="relative h-[450px] w-full md:h-[500px] md:w-[45%] lg:h-[550px]">
          <img
            src="/asset/our story/main chef.png"
            alt="Chef Adrian Moreau"
            className="h-full w-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-black to-transparent md:block" />
        </div>

        <div className="z-10 flex w-full items-center justify-start bg-black p-8 md:w-[55%] md:p-12 lg:pl-24">
          <div className="flex w-full max-w-xl flex-col items-start">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#a68a56] md:text-[13px]"
            >
              CHEF & VISION
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="mb-8 font-serif text-2xl uppercase tracking-widest leading-[1.4] text-[#e6d5b8] md:text-3xl lg:text-[34px]"
            >
              THE VISION BEHIND THE OBSESSION
            </motion.h3>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              className="mb-10 h-[1px] w-16 origin-left"
              style={{ backgroundColor: '#a68a56' }}
            />

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              className="mb-8 font-sans text-[16px] leading-[1.8] tracking-wide text-white/80 md:text-[18px] lg:text-[20px]"
            >
              "Obsidian is not about impressing.<br />It's about expressing truth through flavor,<br />texture, and memory."
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              className="mb-12 font-sans text-[15px] italic tracking-wide text-white/50 md:text-[16px]"
            >
              — Chef Adrian Moreau
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            >
              <a
                href="#chef"
                className="group relative flex items-center justify-center overflow-hidden border border-[#a68a56]/50 px-10 py-5 transition-all duration-500 hover:scale-[1.02] hover:border-[#a68a56] active:scale-[0.98]"
              >
                <div className="absolute inset-0 origin-left scale-x-0 bg-[#a68a56]/10 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative z-10 text-[12px] font-medium uppercase tracking-[0.2em] text-[#a68a56] transition-colors duration-500 md:text-[13px]">
                  MEET CHEF ADRIAN
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryVision;

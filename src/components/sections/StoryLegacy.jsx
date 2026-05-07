import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '1998', title: 'OBSIDIAN IS BORN', desc: 'A vision takes shape in the heart of NYC.' },
  { year: '2005', title: 'FIRST MICHELIN STAR', desc: 'Recognition for relentless excellence.' },
  { year: '2012', title: "WORLD'S 50 BEST", desc: "Named among the world's finest." },
  { year: '2018', title: 'GLOBAL EXPANSION', desc: 'Obsidian experiences reach the world.' },
  { year: '2023', title: 'NEW CHAPTER', desc: 'Redefining luxury dining for a new era.' },
];

const StoryLegacy = () => {
  return (
    <section className="w-full overflow-hidden border-t border-white/[0.05] bg-[#030303] py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="mb-16 flex flex-col items-center justify-center gap-4 text-center md:mb-32 md:flex-row"
        >
          <h2 className="font-serif text-[2rem] uppercase tracking-[0.14em] text-[#e6d5b8] md:text-[36px] lg:text-[40px]">
            Our Legacy
          </h2>
          <div className="h-px w-16 bg-[#a68a56]" />
        </motion.div>

        <div className="relative flex w-full flex-col justify-between gap-4 md:flex-row md:items-stretch md:gap-0">
          {milestones.map((item, index) => {
            const baseDelay = index * 0.3;

            return (
              <div
                key={item.year}
                className="relative flex w-full flex-row items-stretch text-left pb-10 md:pb-0 md:flex-1 md:flex-col md:items-center md:text-center"
              >
                <div className="flex w-full flex-col justify-end pl-5 md:mb-10 md:min-h-[80px] md:items-center md:pl-0">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: baseDelay }}
                    className="mb-3 font-sans text-lg font-semibold tracking-[0.22em] text-white md:mb-5 md:text-xl lg:text-2xl"
                  >
                    {item.year}
                  </motion.span>

                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: baseDelay + 0.2 }}
                    className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#d4af37] md:text-[16px] lg:text-[18px]"
                  >
                    {item.title}
                  </motion.h4>
                </div>

                <div className="relative flex h-full w-8 flex-col items-center justify-start pt-[10px] md:pt-0 md:my-3 md:h-auto md:w-full md:flex-row md:justify-center">
                  {index < milestones.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: false, margin: '-100px' }}
                      transition={{ duration: 0.3, delay: baseDelay + 0.2, ease: 'linear' }}
                      className="absolute top-[20px] bottom-[-10px] left-1/2 z-0 block w-px -translate-x-1/2 origin-top bg-[#d4af37]/30 md:hidden"
                    />
                  )}

                  {index < milestones.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false, margin: '-100px' }}
                      transition={{ duration: 0.5, delay: baseDelay + 0.4, ease: 'linear' }}
                      className="absolute top-1/2 left-1/2 right-[-50%] hidden h-px -translate-y-1/2 origin-left bg-[#d4af37]/30 md:block"
                    />
                  )}

                  {index < milestones.length - 1 && (
                    <motion.div
                      initial={{ left: '50%', opacity: 0 }}
                      whileInView={{ left: '150%', opacity: [0, 1, 1, 0] }}
                      viewport={{ once: false, margin: '-100px' }}
                      transition={{ duration: 0.5, delay: baseDelay + 0.4, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
                      className="pointer-events-none absolute top-1/2 hidden h-[2px] w-16 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e6d5b8] to-transparent shadow-[0_0_12px_#d4af37] md:block"
                    />
                  )}

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.4, delay: baseDelay, type: 'spring', stiffness: 200 }}
                    className="relative z-30 h-2.5 w-2.5 rotate-45 bg-[#d4af37] shadow-[0_0_10px_#d4af37] md:h-3.5 md:w-3.5"
                  />
                </div>

                <div className="mt-1 flex w-full flex-col justify-start pl-5 md:mt-10 md:min-h-[100px] md:items-center md:pl-0">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: baseDelay + 0.3 }}
                    className="text-[14px] leading-7 text-white/60 md:max-w-[260px] md:px-4 md:text-[16px] md:leading-[1.8] lg:text-[17px]"
                  >
                    {item.desc}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryLegacy;

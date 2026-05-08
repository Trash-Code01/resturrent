import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ATMOSPHERE_DATA = [
  {
    img: "/asset/our story/place1.png",
    title: "The Main Room",
    subtitle: "Where the evening begins"
  },
  {
    img: "/asset/our story/place2.png",
    title: "The Cellar",
    subtitle: "A curated collection"
  },
  {
    img: "/asset/our story/place3.png",
    title: "Private Dining",
    subtitle: "Exclusivity & intimacy"
  },
  {
    img: "/asset/our story/place4.png",
    title: "The Lounge",
    subtitle: "Masterful mixology"
  }
];

const StoryAtmosphere = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="relative w-full overflow-hidden border-t border-white/5 bg-[#000000] px-4 py-32 md:px-8 md:py-48 lg:px-12">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37] opacity-[0.02] blur-[150px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] md:text-xs">
              The Experience
            </span>
            <h2 className="font-serif text-[45px] leading-[1.1] tracking-wide text-white sm:text-[60px] md:text-[90px]">
              Atmosphere <br />
              <span className="mt-2 inline-block italic text-white/40 md:mt-4">
                Like No Other
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:max-w-sm"
          >
            <div className="mb-6 hidden h-[1px] w-full bg-white/10 md:block"></div>
            <p className="text-sm font-light leading-relaxed text-white/50 md:text-right md:text-base">
              Step into a world where brutalist architecture and culinary art intertwine. Every
              corner of Obsidian is designed to elevate your senses and create unforgettable memories.
            </p>
          </motion.div>
        </div>

        <div className="flex h-[600px] min-h-[500px] w-full flex-col gap-3 md:h-[70vh] md:flex-row md:gap-4">
          {ATMOSPHERE_DATA.map((item, index) => {
            const isActive = hoveredIndex === index;

            return (
              <motion.div
                key={item.title}
                onHoverStart={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                animate={{ flex: isActive ? 4 : 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] md:rounded-[32px]"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1.5s] ease-out ${
                    isActive
                      ? 'scale-105 brightness-100'
                      : 'scale-100 brightness-50 md:grayscale-[40%]'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div
                  className={`pointer-events-none absolute inset-0 rounded-[24px] border-[2px] transition-colors duration-700 md:rounded-[32px] ${
                    isActive ? 'border-[#d4af37]/30' : 'border-white/5'
                  }`}
                ></div>

                <div className="absolute bottom-0 left-0 flex h-full w-full flex-col justify-end p-6 md:p-10">
                  <div className="mt-auto">
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        height: isActive ? 'auto' : 0,
                        marginBottom: isActive ? '12px' : '0px'
                      }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] md:text-xs">
                        {item.subtitle}
                      </span>
                    </motion.div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`h-[1px] bg-white transition-all duration-700 ${
                          isActive ? 'w-8 opacity-100 md:w-12' : 'w-0 opacity-0'
                        }`}
                      ></div>
                      <h3
                        className={`font-serif whitespace-nowrap text-white transition-all duration-700 ${
                          isActive ? 'text-2xl md:text-4xl' : 'text-xl text-white/60 md:text-2xl'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryAtmosphere;

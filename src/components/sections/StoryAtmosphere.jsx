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
    <section className="relative w-full bg-[#000000] py-32 md:py-48 px-4 md:px-8 lg:px-12 overflow-hidden border-t border-white/5">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] opacity-[0.02] blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           >
              <span className="text-[#d4af37] text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold mb-6 block">The Experience</span>
              <h2 className="text-white font-serif text-[45px] sm:text-[60px] md:text-[90px] leading-[1.1] tracking-wide">
                Atmosphere <br/>
                <span className="italic text-white/40 inline-block mt-2 md:mt-4">Like No Other</span>
              </h2>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="md:max-w-sm"
           >
              <div className="h-[1px] w-full bg-white/10 mb-6 hidden md:block"></div>
              <p className="text-white/50 text-sm md:text-base leading-relaxed font-light md:text-right">
                Step into a world where brutalist architecture and culinary art intertwine. Every corner of Obsidian is designed to elevate your senses and create unforgettable memories.
              </p>
           </motion.div>
        </div>

        {/* Expandable Accordion Gallery */}
        <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[70vh] min-h-[500px] gap-3 md:gap-4">
           {ATMOSPHERE_DATA.map((item, index) => {
              const isActive = hoveredIndex === index;
              
              return (
                <motion.div
                   key={index}
                   onHoverStart={() => setHoveredIndex(index)}
                   onClick={() => setHoveredIndex(index)}
                   animate={{ flex: isActive ? 4 : 1 }}
                   transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                   className="relative rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group"
                >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out ${
                        isActive ? 'scale-105 filter brightness-100' : 'scale-100 filter brightness-50 md:grayscale-[40%]'
                      }`} 
                    />
                    
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                    {/* Gold border glow on active */}
                    <div className={`absolute inset-0 border-[2px] rounded-[24px] md:rounded-[32px] pointer-events-none transition-colors duration-700 ${isActive ? 'border-[#d4af37]/30' : 'border-white/5'}`}></div>

                    {/* Content Container */}
                    <div className="absolute bottom-0 left-0 w-full h-full p-6 md:p-10 flex flex-col justify-end">
                       <div className="mt-auto">
                          
                          {/* Animated Subtitle */}
                          <motion.div 
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0, marginBottom: isActive ? '12px' : '0px' }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                          >
                             <span className="text-[#d4af37] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block whitespace-nowrap">
                               {item.subtitle}
                             </span>
                          </motion.div>
                          
                          {/* Title */}
                          <div className="flex items-center gap-4">
                             <div className={`h-[1px] bg-white transition-all duration-700 ${isActive ? 'w-8 md:w-12 opacity-100' : 'w-0 opacity-0'}`}></div>
                             <h3 className={`font-serif text-white transition-all duration-700 whitespace-nowrap ${isActive ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl text-white/60'}`}>
                               {item.title}
                             </h3>
                          </div>
                          
                       </div>
                    </div>
                </motion.div>
              )
           })}
        </div>

      </div>
    </section>
  );
};

export default StoryAtmosphere;

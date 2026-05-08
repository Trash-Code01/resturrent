import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MenuPreview = () => {
  const [activeTab, setActiveTab] = useState('Signatures');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isCtaPressed, setIsCtaPressed] = useState(false);

  const tabs = ['Signatures', 'Mains', 'Desserts', 'Cocktails'];

  const menuData = {
    'Signatures': [
      { id: 1, name: 'Truffle Caviar Pasta', desc: 'Creamy handmade pasta with black caviar, shaved truffle, parmesan dust, and herb oil.', price: '$120', img: '/asset/ChatGPT Image May 5, 2026, 09_50_18 PM-Photoroom.png' },
      { id: 2, name: 'Wagyu Tomahawk', desc: 'A5-style wagyu tomahawk with smoked sea salt, rosemary jus, roasted garlic, and gold-finished plating.', price: '$210', img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (1)-Photoroom.png' },
      { id: 3, name: 'Gold Leaf Lobster', desc: 'Butter-poached lobster tail with saffron cream, caviar, edible gold leaf, and citrus zest.', price: '$185', img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (4)-Photoroom.png' },
    ],
    'Mains': [
      { id: 4, name: 'Black Cod Miso', desc: 'Charcoal-glazed black cod with bok choy, sesame, yuzu glaze, and spring onion.', price: '$145', img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (1)-Photoroom.png' },
      { id: 5, name: "Duck Breast à l'Orange", desc: 'Crispy duck breast with orange glaze, citrus segments, thyme, and golden sauce pearls.', price: '$150', img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (2)-Photoroom.png' },
      { id: 6, name: 'Lamb Rack Royale', desc: 'Herb-crusted lamb rack with potato purée, red wine jus, rosemary salt, and micro herbs.', price: '$170', img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (3)-Photoroom.png' },
    ],
    'Desserts': [
      { id: 7, name: 'Chocolate Gold Lava Cake', desc: 'Molten chocolate cake with vanilla ice cream, berries, cocoa dust, and edible gold.', price: '$65', img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (4)-Photoroom.png' },
      { id: 8, name: 'Pistachio Rose Mille-Feuille', desc: 'Crisp pastry layers with pistachio cream, rose petals, powdered sugar, and gold flakes.', price: '$58', img: '/asset/ChatGPT Image May 6, 2026, 01_24_31 PM (5)-Photoroom.png' },
      { id: 9, name: 'Vanilla Caviar Crème Brûlée', desc: 'Vanilla bean crème brûlée with caramelized sugar, golden pearls, and delicate sugar crystals.', price: '$55', img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (2)-Photoroom.png' },
    ],
    'Cocktails': [
      { id: 10, name: 'Obsidian Old Fashioned', desc: 'A smoky amber old fashioned with orange peel, crystal ice sphere, bitters, and gold-rimmed glass.', price: '$42', img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (3)-Photoroom.png' },
      { id: 11, name: 'Vintage Negroni', desc: 'Deep red negroni with dried citrus, bitter orange, herbal finish, and gold cocktail pin.', price: '$38', img: '/asset/ChatGPT Image May 6, 2026, 01_21_55 PM-Photoroom.png' },
      { id: 12, name: 'Golden Martini', desc: 'Clear golden martini with lemon twist, olive, chilled glass, and refined botanical notes.', price: '$40', img: '/asset/ChatGPT Image May 6, 2026, 01_25_36 PM (1)-Photoroom.png' },
    ]
  };

  return (
    <section id="menu" className="relative w-full py-32 bg-black overflow-hidden text-white border-y border-[#d4af37]/10">
      
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="flex flex-col items-center w-full">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#d4af37] tracking-[0.3em] text-[10px] md:text-[12px] uppercase font-bold mb-4">
              TASTE THE EXTRAORDINARY
            </p>
            <h2 className="text-[40px] md:text-[60px] lg:text-[72px] font-serif mb-6 text-white leading-none">
              Discover Our Menu
            </h2>
            <div className="w-16 h-px bg-[#d4af37]/50 mx-auto" />
          </div>

          {/* Centered Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 mb-16 border-b border-white/10 pb-6 w-full">
            {tabs.map((tab, index) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`text-2xl md:text-4xl lg:text-5xl font-serif transition-colors duration-500 flex items-center gap-4
                  ${activeTab === tab ? 'text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-white/40 hover:text-white'}`}
              >
                {tab}
                {index !== tabs.length - 1 && <span className="text-[#d4af37]/30 text-sm md:text-xl block ml-4 md:ml-8">◇</span>}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="w-full min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                {menuData[activeTab].map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative border-b border-white/5 pb-8 pt-4 cursor-pointer"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                     <div className="flex items-end justify-between mb-3 gap-4">
                        
                        <div className="flex items-center gap-6">
                          {/* Inline Image Reveal */}
                          <motion.div
                            initial={false}
                            animate={{ 
                              width: hoveredItem === item.id ? 140 : 0, 
                              opacity: hoveredItem === item.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="h-24 md:h-28 overflow-hidden origin-left flex-shrink-0 rounded-md shadow-2xl"
                          >
                            <img 
                              src={item.img} 
                              alt={item.name} 
                              className="h-full w-[140px] object-cover filter brightness-[0.9]" 
                            />
                          </motion.div>

                          <h4 className={`text-2xl md:text-3xl font-serif tracking-wide transition-colors duration-500 ${hoveredItem === item.id ? 'text-[#d4af37]' : 'text-white'}`}>
                            {item.name}
                          </h4>
                        </div>
                        
                        <div className={`flex-1 border-b border-dashed mb-2 mx-6 hidden md:block transition-all duration-500 ${hoveredItem === item.id ? 'border-[#d4af37] opacity-60' : 'border-white/20 opacity-30'}`} />
                        
                        <span className="text-[#d4af37] font-serif text-2xl md:text-3xl whitespace-nowrap">{item.price}</span>
                     </div>
                     
                     <p className={`text-sm md:text-base font-light font-sans tracking-wide transition-all duration-500 ${hoveredItem === item.id ? 'text-gray-300' : 'text-gray-500'}`} style={{ marginLeft: hoveredItem === item.id ? '124px' : '0px' }}>
                        {item.desc}
                     </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Explore CTA */}
          <div className="mt-16 inline-flex">
             <button onClick={() => window.location.href = `/menu#menu-${activeTab.toLowerCase()}`}>
               <motion.div 
                  onMouseDown={() => setIsCtaPressed(true)}
                  onMouseUp={() => setIsCtaPressed(false)}
                  onMouseLeave={() => setIsCtaPressed(false)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group relative px-12 py-5 border border-[#d4af37] text-[#d4af37] uppercase tracking-[0.3em] text-[11px] transition-all duration-700 font-bold overflow-hidden inline-flex items-center justify-center"
               >
                  <span className="relative z-10 group-hover:text-black transition-colors duration-500">Explore Full Menu</span>
                  <div className="absolute inset-0 bg-[#d4af37] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out" />
               </motion.div>
             </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MenuPreview;

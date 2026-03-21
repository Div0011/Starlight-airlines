import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, History, Zap, Shield, Globe, Award } from 'lucide-react';

const milestones = [
  {
    year: '2015',
    title: 'The Conception',
    subtitle: 'From a single blueprint to a bold vision.',
    description: 'Starlight Airlines was founded with one goal: to bring the luxury of a private jet to a global scale. We began with just a single hangar and a plan to redefine the sky.',
    icon: History,
    color: 'from-aurora to-aurora-deep',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '2018',
    title: 'First Cloudbreak',
    subtitle: 'Our flagship 787 takes to the skies.',
    description: 'Our inaugural flight from NYC to London marked the beginning of a new era. We introduced our signature "Starlight Glass" windows — the largest panoramic windows in the sky.',
    icon: Zap,
    color: 'from-stellar to-stellar-deep',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '2021',
    title: 'Celestial Suites',
    subtitle: 'Privacy and Michelin-star luxury.',
    description: 'We launched the Celestial Suites, providing the world’s first fully enclosed private pods in Business Class, featuring curated menus from Chef Elena S.',
    icon: Award,
    color: 'from-solar to-solar-deep',
    img: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '2024',
    title: 'Global Horizon',
    subtitle: '120 destinations, 6 continents.',
    description: 'Today, Starlight Airlines connects the most remote Paradises to the world’s busiest hubs, serving over 42 million passengers annually with unmatched punctuality.',
    icon: Globe,
    color: 'from-nebula to-nebula-deep',
    img: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '2026+',
    title: 'Zero-Emission Era',
    subtitle: 'The future of sustainable flight.',
    description: 'We are pioneering the transition to 100% sustainable aviation fuel and zero-emission electric engines for our short-haul regional fleet. The journey has just begun.',
    icon: Shield,
    color: 'from-aurora to-solar',
    img: 'https://images.unsplash.com/photo-1464039397811-476f652a343b?auto=format&fit=crop&q=80&w=1200'
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    filter: 'blur(20px)',
    scale: 1.1
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '50%' : '-50%',
    opacity: 0,
    filter: 'blur(20px)',
    scale: 0.95
  })
};

const textVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    filter: 'blur(10px)'
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)'
  },
  exit: (direction) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)'
  })
};

export default function InteractiveTimeline() {
  const [[page, direction], setPage] = useState([0, 1]);
  const containerRef = useRef(null);

  const current = ((page % milestones.length) + milestones.length) % milestones.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // Drag handlers for swipe experience
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm flex items-center gap-2">
              <History className="w-4 h-4" /> Our Legacy
            </h2>
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold text-stardust leading-tight">
              A Journey Through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora via-stellar to-solar">The Starlight Story</span>
            </h3>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center text-stardust hover:bg-aurora hover:border-aurora transition-all duration-300 glass-card group"
              data-hover-type="PREV"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center text-stardust hover:bg-aurora hover:border-aurora transition-all duration-300 glass-card group"
              data-hover-type="NEXT"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Year indicator line */}
        <div className="mt-12 h-[2px] w-full bg-white/5 relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-2">
             {milestones.map((m, i) => (
               <button 
                 key={i} 
                 onClick={() => setPage([i, i > current ? 1 : -1])}
                 className={`group relative transition-all duration-500`}
               >
                 <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i === current ? 'bg-aurora border-aurora scale-150 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-cosmic border-white/20 hover:border-aurora/50'}`} />
                 <span className={`absolute top-6 left-1/2 -translate-x-1/2 font-ui text-[10px] tracking-widest uppercase transition-all duration-500 ${i === current ? 'text-stardust opacity-100' : 'text-comet opacity-40'}`}>
                   {m.year}
                 </span>
               </button>
             ))}
          </div>
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-aurora to-solar"
            initial={false}
            animate={{ width: `${(current / (milestones.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] w-full max-w-[1600px] mx-auto overflow-hidden sm:rounded-[40px] isolate">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              filter: { duration: 0.5 },
              scale: { duration: 0.6 }
            }}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s]"
                style={{ backgroundImage: `url('${milestones[current].img}')` }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1629] via-[#0B1629]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629] via-transparent to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-24">
              <div className="max-w-4xl">
                <motion.div
                   custom={direction}
                   variants={textVariants}
                   transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${milestones[current].color} mb-6 shadow-lg`}>
                    <span className="font-heading text-white font-bold tracking-widest text-lg sm:text-2xl">{milestones[current].year}</span>
                  </div>
                  
                  <h4 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tighter drop-shadow-2xl">
                    {milestones[current].title}
                  </h4>
                  
                  <p className="text-xl sm:text-2xl md:text-3xl font-heading font-medium text-aurora/90 mb-6 drop-shadow-md">
                    {milestones[current].subtitle}
                  </p>
                  
                  <p className="text-stardust/80 font-ui text-md sm:text-lg md:text-xl leading-relaxed max-w-2xl drop-shadow-sm">
                    {milestones[current].description}
                  </p>
                </motion.div>

                {/* Parallax elements */}
                <motion.div 
                  className="mt-12 flex items-center gap-4 text-white/40"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-12 h-[1px] bg-white/20" />
                  <span className="text-[10px] sm:text-xs font-ui uppercase tracking-[0.4em]">Slide to explore history</span>
                </motion.div>
              </div>
            </div>

            {/* Milestone Icon Float */}
            <motion.div 
              className="absolute right-12 sm:right-24 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none"
              animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              {React.createElement(milestones[current].icon, { size: 400, strokeWidth: 0.5, className: 'text-white' })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

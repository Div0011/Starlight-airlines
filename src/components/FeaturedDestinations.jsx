import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, PlaneTakeoff, Calendar, MapPin } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

const destinations = [
  {
    id: 1,
    title: 'Dubai',
    subtitle: 'The Futuristic Escape',
    price: '$3,500',
    flightNo: 'SL-772',
    date: 'Dec 15',
    duration: '14h 20m',
    img: `${BASE}images/dubai_skyline.png`,
  },
  {
    id: 2,
    title: 'Swiss Alps',
    subtitle: 'The Alpine Retreat',
    price: '$2,800',
    flightNo: 'SL-405',
    date: 'Jan 10',
    duration: '8h 45m',
    img: `${BASE}images/swiss_alps.png`,
  },
  {
    id: 3,
    title: 'Bora Bora',
    subtitle: 'The Island Paradise',
    price: '$4,200',
    flightNo: 'SL-901',
    date: 'Feb 05',
    duration: '18h 15m',
    img: `${BASE}images/bora_bora.png`,
  }
];

const bgVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    scale: 1.2,
    opacity: 0,
    filter: "blur(24px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "50%" : "-50%",
    scale: 0.9,
    opacity: 0,
    filter: "blur(24px)",
  })
};

const textVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    filter: "blur(12px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    filter: "blur(12px)",
  })
};

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    filter: "blur(20px)",
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    filter: "blur(16px)",
    scale: 0.95,
  })
};

export default function FeaturedDestinations() {
  const [[page, direction], setPage] = useState([0, 1]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const current = ((page % destinations.length) + destinations.length) % destinations.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setPage([page + 1, 1]);
    }, 6000);
    return () => clearInterval(timer);
  }, [page, isAutoPlaying]);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-transparent">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.6 },
            filter: { duration: 0.6 },
            scale: { duration: 0.8 }
          }}
          className="absolute inset-0 origin-center"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-[0.85] contrast-[1.1] saturate-[1.1]"
            style={{ backgroundImage: `url('${destinations[current].img}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629] via-[#0B1629]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20 px-6 sm:px-12 md:px-24 pointer-events-none">
        <div className="max-w-5xl w-full mx-auto relative pointer-events-auto">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${page}`}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 250, damping: 25 },
                opacity: { duration: 0.5 },
                filter: { duration: 0.4 }
              }}
              className="max-w-3xl pointer-events-none"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <div className="flex items-center gap-3 mb-4 text-aurora font-ui tracking-[0.2em] uppercase text-xs sm:text-sm">
                <MapPin className="w-4 h-4" />
                <span>Featured Destination</span>
              </div>
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-heading font-bold text-white drop-shadow-2xl mb-2 sm:mb-4 tracking-tight">
                {destinations[current].title}
              </h2>
              <p className="text-lg sm:text-2xl text-white/90 font-ui mb-8 sm:mb-10 drop-shadow-md">
                {destinations[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`card-${page}`}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.6 },
                filter: { duration: 0.5 },
                delay: 0.05
              }}
              className="glass-card bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full max-w-4xl group pointer-events-auto"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-6 md:mb-0">
                <div>
                  <div className="text-white/60 text-xs font-ui uppercase tracking-widest mb-1.5 flex items-center gap-2"><PlaneTakeoff className="w-3 h-3"/> Flight</div>
                  <div className="text-xl sm:text-2xl font-heading font-semibold text-white">{destinations[current].flightNo}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs font-ui uppercase tracking-widest mb-1.5 flex items-center gap-2"><Calendar className="w-3 h-3"/> Date</div>
                  <div className="text-xl sm:text-2xl font-heading font-semibold text-white">{destinations[current].date}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs font-ui uppercase tracking-widest mb-1.5 flex items-center gap-2">Duration</div>
                  <div className="text-xl sm:text-2xl font-heading font-semibold text-white">{destinations[current].duration}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs font-ui uppercase tracking-widest mb-1.5 flex items-center gap-2">Price From</div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-solar drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">{destinations[current].price}</div>
                </div>
              </div>
              <button 
                className="w-full md:w-auto btn-wind bg-gradient-to-r from-aurora to-aurora-deep text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-ui font-semibold uppercase tracking-wider hover:from-aurora-deep hover:to-aurora hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 md:ml-6 flex-shrink-0"
                data-hover-type="BOOK NOW"
              >
                Book Flight
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-6 sm:right-12 md:right-24 bottom-20 flex gap-4 z-20 pointer-events-auto">
          <button 
            onClick={() => paginate(-1)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white border hover:border-white transition-all backdrop-blur-md group"
            aria-label="Previous destination"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-aurora hover:border-white transition-all backdrop-blur-md group bg-white/10"
            aria-label="Next destination"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 pointer-events-auto">
        {destinations.map((_, i) => (
          <button 
            key={i}
            onClick={() => {
              const newDirection = i > current ? 1 : i < current ? -1 : 0;
              if (newDirection !== 0) {
                setPage([page + (i - current), newDirection]);
                setIsAutoPlaying(false);
              }
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-aurora shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

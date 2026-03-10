import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation as Compass, X, Move } from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Home', path: '/', x: 12, y: 25 },
    { name: 'Book Flights', path: '/search', x: 38, y: 15 },
    { name: 'Experience', path: '/', x: 15, y: 55 },
    { name: 'Our Fleet', path: '/', x: 42, y: 48 },
    { name: 'Destinations', path: '/destinations', x: 68, y: 22 },
    { name: 'Loyalty', path: '/', x: 55, y: 68 },
    { name: 'Offers', path: '/', x: 82, y: 45 },
    { name: 'Careers', path: '/', x: 30, y: 80 },
    { name: 'Contact', path: '/', x: 75, y: 72 },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const constraintRef = useRef(null);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    const hoveredItem = hoveredIdx !== null ? MENU_ITEMS[hoveredIdx] : null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
                className="fixed top-8 right-8 z-[50] w-14 h-14 bg-nebula/80 backdrop-blur-md border border-aurora/20 rounded-full flex items-center justify-center text-stardust hover:text-aurora hover:border-aurora/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all duration-300 group"
                data-hover-type="MENU"
            >
                <Compass size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
                        animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 3rem) 3rem)' }}
                        exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[60] bg-cosmic overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                    >
                        {/* Animated gradient mesh background */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora/5 rounded-full blur-[120px] animate-float" />
                            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solar/5 rounded-full blur-[120px] animate-float-delayed" />
                        </div>

                        {/* Map grid background */}
                        <div
                            className="absolute inset-0 opacity-[0.06] pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)',
                                backgroundSize: '50px 50px'
                            }}
                        />

                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close navigation menu"
                            className="absolute top-8 right-8 z-[70] p-4 text-stardust hover:text-aurora transition-colors duration-300"
                            data-hover-type="CLOSE"
                        >
                            <X size={32} />
                        </button>

                        {/* Draggable map container */}
                        <div ref={constraintRef} className="absolute inset-0 overflow-hidden">
                            <motion.div
                                drag
                                dragConstraints={constraintRef}
                                dragElastic={0.08}
                                dragMomentum
                                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                                className="relative cursor-grab active:cursor-grabbing"
                                style={{ width: '140%', height: '130%', marginLeft: '-20%', marginTop: '-10%', touchAction: 'none' }}
                            >
                                {/* Flight path SVG */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {hoveredItem && MENU_ITEMS.map((item, idx) => {
                                        if (idx === hoveredIdx) return null;
                                        const midX = (hoveredItem.x + item.x) / 2;
                                        const midY = Math.min(hoveredItem.y, item.y) - 12;
                                        return (
                                            <motion.path
                                                key={`line-${idx}`}
                                                d={`M ${hoveredItem.x} ${hoveredItem.y} Q ${midX} ${midY} ${item.x} ${item.y}`}
                                                stroke="rgba(167,139,250,0.3)"
                                                strokeWidth="0.15"
                                                strokeDasharray="0.5 0.5"
                                                fill="none"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                            />
                                        );
                                    })}
                                </svg>

                                {/* Menu items positioned like world map points */}
                                <nav className="relative w-full h-full" aria-label="Main navigation">
                                    {MENU_ITEMS.map((item, idx) => (
                                        <motion.div
                                            key={item.name}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.3 + (idx * 0.08), duration: 0.5, ease: 'easeOut' }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className="relative group flex items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-aurora rounded-lg px-2 py-1"
                                                onMouseEnter={() => setHoveredIdx(idx)}
                                                onMouseLeave={() => setHoveredIdx(null)}
                                                onFocus={() => setHoveredIdx(idx)}
                                                onBlur={() => setHoveredIdx(null)}
                                                data-hover-type="EXPLORE"
                                                aria-label={`Navigate to ${item.name}`}
                                                onPointerDown={(e) => e.stopPropagation()}
                                            >
                                                {/* Map pin dot */}
                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${hoveredIdx === idx
                                                    ? 'bg-solar scale-[2] shadow-[0_0_20px_rgba(251,146,60,0.6)]'
                                                    : 'bg-aurora shadow-[0_0_8px_rgba(167,139,250,0.4)]'
                                                    }`}
                                                />
                                                {/* Ping effect on active dot */}
                                                {hoveredIdx === idx && (
                                                    <motion.div
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-solar/40"
                                                        initial={{ scale: 1, opacity: 0.6 }}
                                                        animate={{ scale: 3, opacity: 0 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    />
                                                )}
                                                <span className={`text-3xl sm:text-4xl md:text-6xl font-heading font-semibold transition-all duration-300 whitespace-nowrap ${hoveredIdx === idx
                                                    ? 'text-stardust drop-shadow-[0_0_20px_rgba(167,139,250,0.6)]'
                                                    : 'text-stardust/30'
                                                    }`}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </motion.div>
                        </div>

                        {/* Bottom hint */}
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-ui text-xs tracking-[0.3em] uppercase text-comet/40 flex items-center gap-2 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <Move size={14} className="text-comet/40" />
                            Drag to pan &middot; Select a destination
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

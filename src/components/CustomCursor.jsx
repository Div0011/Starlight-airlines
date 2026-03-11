import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const TRAIL_COUNT = 12;

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [hoverState, setHoverState] = useState(null);
    const [trails, setTrails] = useState([]);
    const rafRef = useRef(null);
    const posRef = useRef({ x: -100, y: -100 });
    const hoverRef = useRef(null);
    const trailId = useRef(0);
    const lastTrail = useRef(0);

    const spawnTrail = useCallback((x, y) => {
        const now = performance.now();
        if (now - lastTrail.current < 35) return;
        lastTrail.current = now;
        const id = trailId.current++;
        const angle = (Math.random() - 0.5) * 1.2;
        const length = 14 + Math.random() * 22;
        setTrails(prev => {
            const next = [...prev, { id, x, y, angle, length }];
            return next.length > TRAIL_COUNT ? next.slice(-TRAIL_COUNT) : next;
        });
        setTimeout(() => setTrails(prev => prev.filter(t => t.id !== id)), 600);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };

            const el = document.elementFromPoint(e.clientX, e.clientY);
            const card = el?.closest('[data-hover-type]');
            hoverRef.current = card ? (card.getAttribute('data-hover-type') || 'text') : null;

            spawnTrail(e.clientX, e.clientY);

            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    setPosition({ ...posRef.current });
                    setHoverState(hoverRef.current);
                    rafRef.current = null;
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [spawnTrail]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Wind trail particles */}
            {trails.map(t => (
                <motion.div
                    key={t.id}
                    className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
                    style={{
                        width: t.length,
                        height: 1.5,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(96,165,250,0.3), transparent)',
                        transformOrigin: 'left center',
                        rotate: `${t.angle}rad`,
                    }}
                    initial={{ x: t.x, y: t.y, opacity: 0.7, scaleX: 0.3 }}
                    animate={{ x: t.x + 30, y: t.y - 8, opacity: 0, scaleX: 1 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                />
            ))}

            {/* Outer Glow Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] transform-gpu flex items-center justify-center"
                style={{
                    border: '1.5px solid rgba(59,130,246,0.5)',
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    boxShadow: '0 0 12px rgba(59,130,246,0.15)',
                }}
                animate={{
                    x: position.x - 16,
                    y: position.y - 16,
                    scale: hoverState ? 2.5 : 1,
                    backgroundColor: hoverState
                        ? 'rgba(29, 78, 216, 0.85)'
                        : 'rgba(59,130,246,0.08)',
                    borderColor: hoverState
                        ? 'rgba(29,78,216,0)'
                        : 'rgba(59,130,246,0.5)',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    mass: 0.1
                }}
            >
                <span className={`cursor-text ${hoverState && hoverState !== 'plane' ? 'visible' : ''}`}>
                    {hoverState !== 'plane' ? hoverState : ''}
                </span>
                {hoverState === 'plane' && (
                    <span className="absolute text-sm">✈️</span>
                )}
            </motion.div>

            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-aurora rounded-full pointer-events-none z-[10000] shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                animate={{
                    x: position.x - 3,
                    y: position.y - 3,
                    opacity: hoverState ? 0 : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.1
                }}
            />
        </>
    );
}

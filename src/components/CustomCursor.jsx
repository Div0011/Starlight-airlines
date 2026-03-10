import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [hoverState, setHoverState] = useState(null);
    const rafRef = useRef(null);
    const posRef = useRef({ x: -100, y: -100 });
    const hoverRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };

            // Check hover target on every move so state never goes stale
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const card = el?.closest('[data-hover-type]');
            hoverRef.current = card ? (card.getAttribute('data-hover-type') || 'text') : null;

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
    }, []);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Outer Glow Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] transform-gpu flex items-center justify-center"
                style={{
                    border: '1.5px solid rgba(167,139,250,0.4)',
                    backgroundColor: 'rgba(167,139,250,0.08)',
                }}
                animate={{
                    x: position.x - 16,
                    y: position.y - 16,
                    scale: hoverState ? 2.5 : 1,
                    backgroundColor: hoverState
                        ? 'rgba(251, 146, 60, 0.85)'
                        : 'rgba(167,139,250,0.08)',
                    borderColor: hoverState
                        ? 'rgba(251,146,60,0)'
                        : 'rgba(167,139,250,0.4)',
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
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-aurora rounded-full pointer-events-none z-[10000] shadow-[0_0_8px_rgba(167,139,250,0.8)]"
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

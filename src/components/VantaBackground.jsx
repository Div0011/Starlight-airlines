import React, { useEffect, useRef } from 'react';

const VantaBackground = () => {
    const vantaRef = useRef(null);
    useEffect(() => {
        const loadScript = (src) => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        ]).then(() => {
            loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js').then(() => {
                if (window.VANTA && vantaRef.current) {
                    window.vantaEffect = window.VANTA.BIRDS({
                        el: vantaRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        backgroundColor: 0x0B1629,
                        color1: 0x82C3FF,
                        color2: 0xFACC15,
                        birdSize: 1.0,
                        wingSpan: 40,
                        separation: 80,
                        alignment: 50,
                        cohesion: 50,
                        quantity: 3.00,
                        speedLimit: 2.00
                    });
                }
            });
        });

        return () => {
             if (window.vantaEffect) window.vantaEffect.destroy();
        };
    }, []);

    return <div ref={vantaRef} className="fixed inset-0 -z-[100]" />;
};

export default VantaBackground;

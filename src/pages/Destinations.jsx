import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Plane, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
    { id: 1, name: 'Maldives', price: '$4,200', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80', desc: 'Turquoise waters and pristine beaches' },
    { id: 2, name: 'Tokyo', price: '$1,800', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80', desc: 'Neon lights and ancient traditions' },
    { id: 3, name: 'Santorini', price: '$2,100', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80', desc: 'White architecture against the Aegean Sea' },
    { id: 4, name: 'Dubai', price: '$3,500', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80', desc: 'Futuristic skyline and desert adventures' },
];

function DestinationCard({ dest, idx, scrollYProgress }) {
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, idx % 2 === 0 ? -80 : 80]);

    return (
        <motion.div
            style={{ y: yOffset }}
            className="group relative h-[350px] sm:h-[500px] md:h-[700px] rounded-[24px] sm:rounded-[32px] overflow-hidden cursor-pointer isolate transform-gpu transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(167,139,250,0.12)]"
            data-hover-type="EXPLORE"
        >
            {/* Image layer */}
            <div className="absolute inset-0 bg-cosmic -z-10 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${dest.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic via-cosmic/30 to-transparent transition-opacity duration-700" />
            </div>

            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-[32px] border border-white/[0.04] group-hover:border-aurora/20 transition-colors duration-500 z-10 pointer-events-none" />

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-stardust transform-gpu z-10">
                <div className="flex justify-between items-end transition-transform duration-500 transform group-hover:-translate-y-4">
                    <div>
                        <motion.h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-semibold mb-3 drop-shadow-md">
                            {dest.name}
                        </motion.h2>
                        <p className="font-ui text-sm uppercase tracking-widest text-stardust/70 drop-shadow-sm border-l-2 border-aurora pl-4">
                            {dest.desc}
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-ui uppercase tracking-widest text-comet mb-1">From</div>
                        <div className="text-2xl md:text-3xl lg:text-4xl font-heading text-solar drop-shadow-md">{dest.price}</div>
                    </div>
                </div>

                {/* Hover reveal actions */}
                <div className="flex justify-between items-center mt-6 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-aurora border-b border-aurora/50 pb-1 hover:border-aurora transition-colors">View Itineraries</span>
                    <button className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-aurora hover:border-aurora hover:text-cosmic transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function Destinations() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-32 overflow-hidden relative">
            {/* Top ambient glow */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-aurora/5 to-transparent pointer-events-none" />
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-aurora/[0.03] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-solar/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-stardust max-w-2xl leading-tight">
                            Explore Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora via-stellar to-solar">World</span>
                        </h1>
                        <p className="font-ui text-comet tracking-[0.2em] uppercase text-sm mt-6">Discover unparalleled beauty</p>
                    </div>
                    <div className="flex items-center gap-4 border border-aurora/15 rounded-full px-6 py-2.5 backdrop-blur-md bg-nebula/30">
                        <Plane className="w-5 h-5 text-aurora" />
                        <span className="font-ui text-xs uppercase tracking-widest text-stardust">Global Routes</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
                    {DESTINATIONS.map((dest, idx) => (
                        <DestinationCard
                            key={dest.id}
                            dest={dest}
                            idx={idx}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

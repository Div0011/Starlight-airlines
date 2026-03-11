import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Tag, Plane, Utensils } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

const OFFERS = [
    { id: 1, title: 'Business Class Sale', price: 'Up to 40% Off', img: `${BASE}images/business_class.png`, desc: 'Secure premium routes to Europe at unbeatable prices. Limited availability until Nov 30.', tag: 'Premium' },
    { id: 2, title: 'New Maldives Route', price: 'From $2,899', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80', desc: 'Direct daily flights starting this winter. Book now for introductory fares and complimentary lounge access.', tag: 'New Route' },
    { id: 3, title: 'Michelin Star Dining', price: 'Complimentary', img: `${BASE}images/fine_dining.png`, desc: 'Our new inflight menu curated by world-renowned chefs. Available on all First and Business Class flights.', tag: 'Experience' },
    { id: 4, title: 'Holiday Getaway Package', price: 'From $1,499', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80', desc: 'Flight + 5-star hotel bundles to Santorini, Bali, and Dubai. Book by Dec 15 for exclusive savings.', tag: 'Bundle' },
];

function OfferCard({ offer, idx, scrollYProgress }) {
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, idx % 2 === 0 ? -30 : 30]);

    return (
        <motion.div
            style={{ y: yOffset }}
            className="group relative h-[350px] sm:h-[500px] md:h-[700px] rounded-[24px] sm:rounded-[32px] overflow-hidden cursor-pointer isolate transform-gpu transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)]"
            data-hover-type="EXPLORE"
        >
            {/* Image layer */}
            <div className="absolute inset-0 bg-[#0B1629] -z-10 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${offer.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629] via-[#0B1629]/40 to-transparent transition-opacity duration-700" />
            </div>

            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-[32px] border border-white/10 group-hover:border-aurora/40 transition-colors duration-500 z-10 pointer-events-none" />

            {/* Tag badge */}
            <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-1.5 rounded-full bg-aurora/15 backdrop-blur-md text-aurora font-ui text-xs tracking-widest uppercase border border-aurora/20">{offer.tag}</span>
            </div>

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-stardust transform-gpu z-10">
                <div className="flex justify-between items-end transition-transform duration-500 transform group-hover:-translate-y-4">
                    <div className="flex-1 mr-6">
                        <motion.h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-semibold mb-3 drop-shadow-md">
                            {offer.title}
                        </motion.h2>
                        <p className="font-ui text-sm text-stardust/70 drop-shadow-sm leading-relaxed max-w-md">
                            {offer.desc}
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="text-xs font-ui uppercase tracking-widest text-comet mb-1">Price</div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-solar drop-shadow-md">{offer.price}</div>
                    </div>
                </div>

                {/* Hover reveal actions */}
                <div className="flex justify-between items-center mt-6 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-aurora border-b border-aurora/50 pb-1 hover:border-aurora transition-colors">View Details</span>
                    <button className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-aurora hover:border-aurora hover:text-white transition-all duration-300">
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
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
        >
        <div ref={containerRef} className="min-h-screen pt-32 pb-48 overflow-hidden relative">
            {/* Top ambient glow */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-solar/5 to-transparent pointer-events-none" />
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar via-aurora to-stellar">Offers</span>
                        </h1>
                        <p className="font-ui text-comet tracking-[0.2em] uppercase text-sm mt-6">Exclusive deals curated for you</p>
                    </div>
                    <div className="flex items-center gap-4 border border-aurora/15 rounded-full px-6 py-2.5 backdrop-blur-md bg-nebula/30">
                        <Tag className="w-5 h-5 text-solar" />
                        <span className="font-ui text-xs uppercase tracking-widest text-stardust">Limited Time</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
                    {OFFERS.map((offer, idx) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            idx={idx}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>
        </motion.div>
    );
}

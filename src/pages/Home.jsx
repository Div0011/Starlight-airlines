import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, Briefcase, ArrowRight, Star, Globe, Shield, Clock, Award, Download, Quote } from 'lucide-react';
import FeaturedDestinations from '../components/FeaturedDestinations';
import InteractiveTimeline from '../components/InteractiveTimeline';

const FRAME_COUNT = 160;
const BASE = import.meta.env.BASE_URL;

/* ── Lazy Image component ── */
function LazyImg({ src, alt, className, style }) {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: '200px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={className} style={style}>
            {inView && (
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url('${src}')` }}
                >
                    <img src={src} alt={alt} className="sr-only" onLoad={() => setLoaded(true)} />
                </div>
            )}
        </div>
    );
}

/* ── Animated section wrapper with different reveal effects ── */
const revealVariants = {
    slideUp: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    slideLeft: { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
    slideRight: { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
    zoomIn: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
    fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

function RevealSection({ children, variant = 'fadeIn', className = '', delay = 0 }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={revealVariants[variant]}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative z-10 ${className}`}
        >
            {children}
        </motion.div>
    );
}

/* ── Animated counter ── */
function AnimatedCounter({ end, suffix = '' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setVal(end); clearInterval(timer); }
            else setVal(start);
        }, 30);
        return () => clearInterval(timer);
    }, [isInView, end]);

    return <span ref={ref}>{val}{suffix}</span>;
}

export default function Home() {
    const heroRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [loaded, setLoaded] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const loadedImages = [];
        let loadCount = 0;

        const tick = () => {
            loadCount++;
            setLoaded(loadCount);
            if (loadCount >= Math.floor(FRAME_COUNT * 0.3)) setReady(true);
        };

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `${BASE}images/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            img.onload = tick;
            img.onerror = tick;
            loadedImages.push(img);
        }
        setImages(loadedImages);

        const timer = setTimeout(() => setReady(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    /* Scroll-driven canvas animation — contained in the hero wrapper only */
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const frameIndex = useTransform(scrollYProgress, [0, 0.75], [0, FRAME_COUNT - 1], { clamp: true });
    const titleOpacity = useTransform(scrollYProgress, [0.65, 0.8, 0.92, 1.0], [0, 1, 1, 0]);
    const titleBlur = useTransform(scrollYProgress, [0.65, 0.8, 0.92, 1.0], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
    const titleY = useTransform(scrollYProgress, [0.92, 1.0], ['0vh', '-10vh']);

    const drawFrame = useCallback((latestIndex) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(latestIndex)));
        const img = images[index];
        if (!img?.complete) return;
        const w = window.innerWidth, h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        const ratio = Math.max((w * dpr) / img.width, (h * dpr) / img.height);
        const sx = (w * dpr - img.width * ratio) / 2, sy = (h * dpr - img.height * ratio) / 2;
        ctx.clearRect(0, 0, w * dpr, h * dpr);
        ctx.save(); ctx.translate(sx, sy); ctx.scale(ratio, ratio); ctx.drawImage(img, 0, 0); ctx.restore();
    }, [images]);

    useEffect(() => {
        drawFrame(frameIndex.get());
        const unsub = frameIndex.on('change', drawFrame);
        const onResize = () => drawFrame(frameIndex.get());
        window.addEventListener('resize', onResize);
        return () => { unsub(); window.removeEventListener('resize', onResize); };
    }, [drawFrame, frameIndex]);

    return (
        <div className="relative">
            {/* ── Loading Screen ── */}
            {!ready && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1629] flex-col gap-6" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <div className="w-12 h-12 flex items-center justify-center opacity-80 backdrop-blur-sm overflow-hidden p-1">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Starlight Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                    </motion.div>
                    <div className="text-stardust font-ui text-sm tracking-widest uppercase">
                        Preparing Departure... {Math.round((loaded / FRAME_COUNT) * 100)}%
                    </div>
                    <div className="w-48 h-1 bg-nebula rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-aurora to-solar rounded-full" style={{ width: `${(loaded / FRAME_COUNT) * 100}%` }} />
                    </div>
                </motion.div>
            )}

            {/* ════════════════════════════════════════
                 HERO — Scroll-driven canvas animation
                 ════════════════════════════════════════ */}
            <div ref={heroRef} className="relative h-[400vh]">
                <div className="sticky top-0 h-screen overflow-hidden isolate">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'contrast(1.08) saturate(1.1) brightness(1.05)', imageRendering: '-webkit-optimize-contrast' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629]/60 via-transparent to-[#0B1629]/30 pointer-events-none" />

                    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ opacity: titleOpacity, y: titleY, filter: titleBlur }}>
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl sm:text-5xl md:text-8xl font-heading font-bold text-white drop-shadow-2xl tracking-tighter text-center" style={{ textShadow: '0 0 60px rgba(59,130,246,0.4)' }}>
                                STARLIGHT AIRLINES
                            </h1>
                            <p className="font-ui text-white/80 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-3 sm:mt-4 text-center text-xs sm:text-sm">Escape to Paradise</p>
                            <motion.div className="mt-8 w-16 h-[2px] bg-gradient-to-r from-transparent via-aurora to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1 }} />
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none" style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}>
                        <span className="font-ui text-xs tracking-[0.3em] uppercase text-white/60">Scroll to explore</span>
                        <motion.div className="w-5 h-8 rounded-full border border-aurora/30 flex justify-center pt-2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                            <motion.div className="w-1 h-2 bg-aurora rounded-full" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                 GROUP 1 — Booking (Search + Experience)
                 Normal flow, subtle fade-in
                 ════════════════════════════════════════ */}
            {/* Search Form */}
            <section className="relative py-24 sm:py-32 bg-pair-action">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-aurora/[0.03] rounded-full blur-[150px] animate-float" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-solar/[0.03] rounded-full blur-[150px] animate-float-delayed" />
                </div>
                <RevealSection variant="fadeIn" className="max-w-4xl mx-auto px-4">
                    <div className="glass-card glass-shine p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.1)]">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold mb-5 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-aurora via-stellar to-solar">Where to next?</h2>
                        <form className="grid grid-cols-1 md:grid-cols-4 gap-5" onSubmit={(e) => { e.preventDefault(); navigate('/search'); }}>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DEPARTURE</label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <input data-hover-type="TYPE" type="text" placeholder="NYC - New York" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 pl-12 pr-4 text-stardust placeholder:text-comet/40 outline-none focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all placeholder:font-light" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DESTINATION</label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5 rotate-90" />
                                    <input data-hover-type="TYPE" type="text" placeholder="MLE - Maldives" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 pl-12 pr-4 text-stardust placeholder:text-comet/40 outline-none focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DATES</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <input data-hover-type="DATES" type="text" placeholder="Nov 12 - Nov 19" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none focus:border-aurora transition-all" readOnly />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">PASSENGERS</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <select data-hover-type="SELECT" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none appearance-none focus:border-aurora transition-all">
                                        <option>2 Adults</option>
                                        <option>1 Adult</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">CLASS</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <select data-hover-type="SELECT" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none appearance-none focus:border-aurora transition-all">
                                        <option>First Class</option>
                                        <option>Business</option>
                                        <option>Economy</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" data-hover-type="FLIGHT" className="btn-wind col-span-1 md:col-span-4 mt-4 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-aurora to-aurora-deep hover:from-aurora-deep hover:to-aurora text-white font-ui font-semibold tracking-wider uppercase transition-all duration-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_30px_rgba(29,78,216,0.4)] group">
                                <span className="group-hover:tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3">
                                    Search Flights <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    </div>
                </RevealSection>
            </section>

            {/* Featured Destinations Carousel Section */}
            <FeaturedDestinations />

            {/* The Experience */}
            <section className="relative py-16 sm:py-24 bg-pair-experience">
                <RevealSection variant="fadeIn" className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
                        <div className="flex-1 w-full relative h-[300px] sm:h-[400px] md:h-[500px] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-2xl" data-hover-type="EXPLORE">
                            <LazyImg src={`${BASE}images/business_class.png`} alt="Business Class" className="absolute inset-0" />
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: `url('${BASE}images/business_class.png')` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629]/90 via-[#0B1629]/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-stardust">
                                <h3 className="text-3xl md:text-4xl font-heading font-semibold mb-2">The Celestial Suite</h3>
                                <p className="font-ui text-sm text-aurora tracking-widest uppercase">First Class Reimagined</p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-8">
                            <div>
                                <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm">Unrivaled Comfort</h2>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-stardust">The Art of <br /> Premium Travel</h3>
                                <p className="text-comet font-ui leading-loose mt-6 max-w-lg">
                                    Experience the luxury of absolute privacy and five-star dining miles above the clouds.
                                    Every detail of your journey is crafted for utmost comfort and serene relaxation.
                                </p>
                            </div>
                            <div className="flex items-center gap-6 group hover:translate-x-1 transition-transform">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-cover bg-center border border-aurora/20 group-hover:border-aurora/50 transition-colors shadow-lg" style={{ backgroundImage: `url('${BASE}images/fine_dining.png')` }} />
                                <div>
                                    <div className="font-heading text-xl text-stardust">Gourmet Dining</div>
                                    <div className="font-ui text-xs tracking-widest uppercase text-comet mt-1">Curated by top chefs</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group hover:translate-x-1 transition-transform">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-cover bg-center border border-aurora/20 group-hover:border-aurora/50 transition-colors shadow-lg" style={{ backgroundImage: `url('${BASE}images/luxury_lounge.png')` }} />
                                <div>
                                    <div className="font-heading text-xl text-stardust">Lounge Access</div>
                                    <div className="font-ui text-xs tracking-widest uppercase text-comet mt-1">Relax before departure</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RevealSection>
            </section>

            {/* Interactive Timeline Journey */}
            <InteractiveTimeline />

            {/* ════════════════════════════════════════
                 TRANSITION 1 → Slide Up
                 GROUP 2 — Company (Fleet + Loyalty)
                 ════════════════════════════════════════ */}

            {/* Fleet & Stats */}
            <section className="relative py-24 sm:py-32 bg-pair-reach">
                <RevealSection variant="slideUp" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-8 sm:mb-14">
                        <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-3 sm:mb-4 text-xs sm:text-sm">Our Fleet</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-6xl font-heading font-semibold text-stardust">Flying the Future</h3>
                        <p className="text-comet font-ui mt-4 max-w-2xl mx-auto leading-relaxed">The most modern fleet in the sky. Quiet cabins, panoramic windows, and zero-emission engines on every route.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                        {[
                            { icon: Plane, label: 'Daily Flights', value: 850, suffix: '+' },
                            { icon: Globe, label: 'Destinations', value: 120, suffix: '+' },
                            { icon: Users, label: 'Million Passengers', value: 42, suffix: 'M' },
                            { icon: Clock, label: 'On-Time Rate', value: 98, suffix: '%' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="glass-card glass-shine rounded-3xl p-5 sm:p-8 text-center group hover:border-aurora/30 transition-all duration-500"
                                whileHover={{ y: -6 }}
                            >
                                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-aurora mx-auto mb-4 sm:mb-5 group-hover:text-solar transition-colors duration-300" />
                                <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-stardust mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="font-ui text-xs tracking-widest uppercase text-comet">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-8 sm:mt-12 flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 justify-center items-center">
                        {['Boeing 787 Dreamliner', 'Airbus A350-1000', 'Boeing 777X', 'Airbus A321neo'].map((plane, idx) => (
                            <div key={idx} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 text-comet font-ui text-xs sm:text-sm tracking-wider hover:border-aurora hover:text-stardust transition-all">
                                {plane}
                            </div>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* Loyalty Program */}
            <section className="relative py-16 sm:py-24 bg-pair-engagement">
                <RevealSection variant="slideUp" delay={0.1} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="glass-card p-5 sm:p-10 md:p-16 rounded-[24px] sm:rounded-[32px] flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16 relative overflow-hidden shadow-[0_8px_40px_rgba(59,130,246,0.08)]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-solar/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-aurora/5 rounded-full blur-[100px]" />
                        <div className="flex-1 z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Star className="text-solar fill-solar w-6 h-6" />
                                <span className="font-ui tracking-[0.3em] uppercase text-solar text-sm">Starlight Rewards</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-stardust mb-4 sm:mb-6">Elevate your status.</h2>
                            <p className="text-comet font-ui leading-loose mb-8">
                                Earn miles on every journey. Redeem for complimentary upgrades, luxury hotel stays, and exclusive access to our world-wide network of premium lounges.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-10">
                                {['Silver', 'Gold', 'Platinum', 'Diamond'].map((tier, idx) => (
                                    <div key={idx} className={`px-5 py-2 rounded-full text-sm font-ui tracking-wider border ${idx === 3 ? 'border-aurora text-aurora-deep bg-aurora/15' : 'border-white/10 text-comet'}`}>
                                        {tier}
                                    </div>
                                ))}
                            </div>
                            <button className="btn-wind px-8 py-4 rounded-full bg-gradient-to-r from-aurora to-aurora-deep hover:from-aurora-deep hover:to-aurora text-white font-ui uppercase tracking-widest font-semibold transition-all duration-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)]" data-hover-type="JOIN">
                                Join The Club
                            </button>
                        </div>
                        <div className="flex-1 w-full flex justify-center z-10 relative">
                            <img src={`${BASE}images/loyalty_card.png`} className="w-[80%] max-w-[400px] object-cover rounded-3xl animate-float shadow-2xl" alt="Loyalty Card" loading="lazy" />
                        </div>
                    </div>
                </RevealSection>
            </section>

            {/* ════════════════════════════════════════
                 TRANSITION 2 → Slide Left / Right
                 GROUP 3 — Discovery (Testimonials + World)
                 ════════════════════════════════════════ */}

            {/* Testimonials */}
            <section className="relative py-24 sm:py-32 bg-pair-experience">
                <RevealSection variant="slideLeft" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm">Traveler Stories</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-6xl font-heading font-semibold text-stardust">What Our Guests Say</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Elena S.', route: 'NYC → Tokyo', rating: 5, text: 'The Celestial Suite was beyond anything I\'ve experienced. Michelin-level dining at 40,000 feet — absolutely extraordinary.' },
                            { name: 'James P.', route: 'London → Maldives', rating: 5, text: 'From the premium lounge to the lie-flat beds, every moment felt like a five-star hotel. I won\'t fly any other airline.' },
                            { name: 'Aisha K.', route: 'Dubai → Paris', rating: 5, text: 'The crew remembered my name, my preferences, everything. It felt like having a personal concierge in the sky.' },
                        ].map((review, idx) => (
                            <motion.div
                                key={idx}
                                className="glass-card glass-shine rounded-3xl p-5 sm:p-8 relative group hover:border-aurora/30 transition-all duration-500"
                                whileHover={{ y: -6 }}
                            >
                                <Quote className="w-8 h-8 text-aurora/20 mb-4" />
                                <p className="text-stardust/80 font-ui leading-relaxed mb-6 text-sm">{review.text}</p>
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-solar fill-solar" />
                                    ))}
                                </div>
                                <div className="font-heading text-lg text-stardust">{review.name}</div>
                                <div className="font-ui text-xs text-aurora tracking-widest uppercase mt-1">{review.route}</div>
                            </motion.div>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* Explore Our World */}
            <section className="relative py-16 sm:py-24 bg-pair-reach">
                <RevealSection variant="slideRight" className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-10 gap-3">
                        <div>
                            <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-3 text-xs sm:text-sm">Destinations</h2>
                            <h3 className="text-2xl sm:text-4xl md:text-6xl font-heading font-bold text-stardust leading-tight">
                                Explore Our{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora via-stellar to-solar">World</span>
                            </h3>
                        </div>
                        <button onClick={() => navigate('/destinations')} className="flex items-center gap-3 text-stardust font-ui uppercase tracking-widest text-xs sm:text-sm hover:text-aurora transition-colors group" data-hover-type="VIEW ALL">
                            All Destinations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                        {[
                            { name: 'Maldives', price: '$4,200', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=900', desc: 'Turquoise waters and pristine beaches' },
                            { name: 'Tokyo', price: '$1,800', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=900', desc: 'Neon lights and ancient traditions' },
                            { name: 'Santorini', price: '$2,100', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=900', desc: 'White architecture against the Aegean Sea' },
                            { name: 'Dubai', price: '$3,500', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=900', desc: 'Futuristic skyline and desert adventures' },
                        ].map((dest, idx) => (
                            <motion.div
                                key={idx}
                                className="relative h-[300px] sm:h-[400px] md:h-[480px] rounded-[20px] sm:rounded-[28px] overflow-hidden cursor-pointer group isolate"
                                data-hover-type="EXPLORE"
                                whileHover={{ y: -6, transition: { duration: 0.4 } }}
                                onClick={() => navigate('/destinations')}
                            >
                                <div className="absolute inset-0 -z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110" style={{ backgroundImage: `url('${dest.img}')` }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629]/90 via-[#0B1629]/20 to-transparent" />
                                </div>
                                <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] border border-white/10 group-hover:border-aurora/40 transition-colors duration-500 z-10 pointer-events-none" />
                                <div className="absolute inset-0 p-5 sm:p-7 md:p-8 flex flex-col justify-end z-10">
                                    <div className="flex justify-between items-end transition-transform duration-500 group-hover:-translate-y-2">
                                        <div>
                                            <h4 className="text-xl sm:text-2xl md:text-4xl font-heading font-semibold text-stardust mb-1 sm:mb-2 drop-shadow-md">{dest.name}</h4>
                                            <p className="font-ui text-[10px] sm:text-xs uppercase tracking-widest text-stardust/70 drop-shadow-sm border-l-2 border-aurora pl-3">{dest.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] sm:text-xs font-ui uppercase tracking-widest text-comet mb-1">From</div>
                                            <div className="text-lg sm:text-xl md:text-3xl font-heading font-bold text-solar drop-shadow-md">{dest.price}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        <span className="font-ui text-[10px] sm:text-xs tracking-[0.15em] uppercase text-aurora border-b border-aurora/50 pb-0.5">View Itineraries</span>
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-aurora hover:border-aurora hover:text-white transition-all duration-300 text-stardust">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* ════════════════════════════════════════
                 TRANSITION 3 → Zoom In
                 GROUP 4 — Conversion (Offers + CTA)
                 ════════════════════════════════════════ */}

            {/* Explore Our Offers */}
            <section className="relative py-24 sm:py-32 bg-pair-action">
                <RevealSection variant="zoomIn" className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
                        <div>
                            <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm">Exclusive Deals</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-stardust leading-tight">
                                Explore Our <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar via-aurora to-stellar">Offers</span>
                            </h3>
                        </div>
                        <button onClick={() => navigate('/destinations')} className="flex items-center gap-3 text-stardust font-ui uppercase tracking-widest text-sm hover:text-aurora transition-colors group" data-hover-type="VIEW ALL">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { title: 'Business Class Sale', desc: 'Secure up to 40% off on premium routes to Europe until Nov 30.', img: `${BASE}images/business_class.png` },
                            { title: 'New Maldives Route', desc: 'Direct daily flights starting this winter. Book now for introductory fares.', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=95&w=1200' },
                            { title: 'Michelin Star Dining', desc: 'Announcing our new inflight menu curated by world-renowned chefs.', img: `${BASE}images/fine_dining.png` }
                        ].map((offer, idx) => (
                            <motion.div
                                key={idx}
                                className="group cursor-pointer"
                                data-hover-type="EXPLORE"
                                whileHover={{ y: -8 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="h-56 md:h-64 rounded-2xl overflow-hidden mb-5 relative border border-white/10 group-hover:border-aurora/40 transition-colors">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110" style={{ backgroundImage: `url('${offer.img}')` }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1629]/60 to-transparent" />
                                </div>
                                <div className="font-ui text-xs text-aurora tracking-widest uppercase mb-3 border-l-2 border-aurora pl-3">Offer</div>
                                <h3 className="font-heading text-xl md:text-2xl text-stardust mb-2 group-hover:text-aurora transition-colors">{offer.title}</h3>
                                <p className="font-ui text-comet text-sm leading-relaxed">{offer.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </RevealSection>
            </section>

            {/* CTA / Download App */}
            <section className="relative py-16 sm:py-24 pb-32 bg-pair-engagement">
                <RevealSection variant="zoomIn" delay={0.1} className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="glass-card rounded-[24px] sm:rounded-[40px] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_8px_40px_rgba(59,130,246,0.08)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-aurora/5 rounded-full blur-[120px]" />
                        <div className="relative z-10">
                            <motion.div
                                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-3xl bg-gradient-to-br flex items-center justify-center border border-white/10 shadow-[0_4px_30px_rgba(255,255,255,0.1)] backdrop-blur-sm overflow-hidden p-2"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Starlight Logo" className="w-full h-full object-cover scale-110" />
                            </motion.div>
                            <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-bold text-stardust mb-4 sm:mb-6">Ready for Takeoff?</h2>
                            <p className="text-comet font-ui leading-relaxed max-w-2xl mx-auto mb-10 text-lg">
                                Download the Starlight app for exclusive mobile-only fares, real-time flight tracking, and instant boarding passes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                <button className="btn-wind px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-aurora to-aurora-deep hover:from-aurora-deep hover:to-aurora text-white font-ui font-semibold tracking-wider uppercase transition-all duration-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)] group flex items-center gap-3" data-hover-type="DOWNLOAD">
                                    <Download className="w-5 h-5" />
                                    <span>Download App</span>
                                </button>
                                <button onClick={() => navigate('/search')} className="btn-wind px-8 sm:px-10 py-4 sm:py-5 rounded-2xl border border-aurora/40 text-stardust font-ui font-semibold tracking-wider uppercase hover:bg-aurora/15 hover:border-aurora transition-all duration-500 group flex items-center gap-3" data-hover-type="BOOK NOW">
                                    <span>Book a Flight</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="flex flex-wrap justify-center gap-8 text-comet/60">
                                <div className="flex items-center gap-2 font-ui text-sm"><Shield className="w-4 h-4" /> Secure Booking</div>
                                <div className="flex items-center gap-2 font-ui text-sm"><Award className="w-4 h-4" /> Best Price Guarantee</div>
                                <div className="flex items-center gap-2 font-ui text-sm"><Clock className="w-4 h-4" /> 24/7 Support</div>
                            </div>
                        </div>
                    </div>
                </RevealSection>
            </section>
        </div>
    );
}

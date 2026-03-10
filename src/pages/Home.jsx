import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, Briefcase, ArrowRight, Star, Globe, Shield, Clock, Award, MapPin, Phone, Mail, Download, ChevronRight, Quote, Anchor } from 'lucide-react';

const FRAME_COUNT = 160;

const BASE = import.meta.env.BASE_URL;

export default function Home() {
    const containerRef = useRef(null);
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
            // Show the page once 30% of frames are in (fast perceived load)
            if (loadCount >= Math.floor(FRAME_COUNT * 0.3)) {
                setReady(true);
            }
        };

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const paddedIndex = i.toString().padStart(3, '0');
            img.src = `${BASE}images/ezgif-frame-${paddedIndex}.jpg`;
            img.onload = tick;
            img.onerror = tick; // count failures so we never get stuck
            loadedImages.push(img);
        }
        setImages(loadedImages);

        // Safety timeout — show the site after 5s no matter what
        const timer = setTimeout(() => setReady(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    let frameIndex = useTransform(scrollYProgress, [0, 0.15], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;

        const updateFrame = (latestIndex) => {
            const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(latestIndex)));
            const img = images[index];

            if (img && img.complete) {
                const w = window.innerWidth;
                const h = window.innerHeight;

                // Size canvas to physical pixels for HiDPI sharpness
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                const hRatio = (w * dpr) / img.width;
                const vRatio = (h * dpr) / img.height;
                const ratio = Math.max(hRatio, vRatio);

                const centerShiftX = (w * dpr - img.width * ratio) / 2;
                const centerShiftY = (h * dpr - img.height * ratio) / 2;

                ctx.clearRect(0, 0, w * dpr, h * dpr);
                ctx.save();
                ctx.translate(centerShiftX, centerShiftY);
                ctx.scale(ratio, ratio);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
            }
        };

        updateFrame(frameIndex.get());
        const unsubscribe = frameIndex.on('change', updateFrame);
        const handleResize = () => updateFrame(frameIndex.get());
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [images, frameIndex]);

    // Background Overlay
    const overlayOpacity = useTransform(scrollYProgress, [0.22, 0.27], [0, 0.88]);

    // SCENE 1: Brand Title (0.00 – 0.17)
    const titleOpacity = useTransform(scrollYProgress, [0.10, 0.13, 0.60, 0.65], [0, 1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0.14, 0.18], ['0vh', '-35vh']);
    const titleScale = useTransform(scrollYProgress, [0.14, 0.18], [1, 0.4]);

    // SCENE 2: Search Form (0.17 – 0.27)
    const formOpacity = useTransform(scrollYProgress, [0.18, 0.21, 0.25, 0.28], [0, 1, 1, 0]);
    const formYValue = useTransform(scrollYProgress, [0.18, 0.21, 0.25, 0.28], [100, 0, 0, -100]);
    const formScale = useTransform(scrollYProgress, [0.25, 0.28], [1, 0.9]);

    // SCENE 3: Experience (0.28 – 0.38)
    const expOpacity = useTransform(scrollYProgress, [0.29, 0.32, 0.36, 0.39], [0, 1, 1, 0]);
    const expYValue = useTransform(scrollYProgress, [0.29, 0.32, 0.36, 0.39], [100, 0, 0, -100]);

    // SCENE 4: Fleet & Stats (0.39 – 0.49)
    const fleetOpacity = useTransform(scrollYProgress, [0.40, 0.43, 0.47, 0.50], [0, 1, 1, 0]);
    const fleetYValue = useTransform(scrollYProgress, [0.40, 0.43, 0.47, 0.50], [100, 0, 0, -100]);

    // SCENE 5: Loyalty (0.50 – 0.60)
    const loyOpacity = useTransform(scrollYProgress, [0.51, 0.54, 0.58, 0.61], [0, 1, 1, 0]);
    const loyYValue = useTransform(scrollYProgress, [0.51, 0.54, 0.58, 0.61], [100, 0, 0, -100]);

    // SCENE 6: Testimonials (0.61 – 0.71)
    const testOpacity = useTransform(scrollYProgress, [0.62, 0.65, 0.69, 0.72], [0, 1, 1, 0]);
    const testYValue = useTransform(scrollYProgress, [0.62, 0.65, 0.69, 0.72], [100, 0, 0, -100]);

    // SCENE 7: Popular Routes (0.72 – 0.82)
    const routeOpacity = useTransform(scrollYProgress, [0.73, 0.76, 0.80, 0.83], [0, 1, 1, 0]);
    const routeYValue = useTransform(scrollYProgress, [0.73, 0.76, 0.80, 0.83], [100, 0, 0, -100]);

    // SCENE 8: News & Offers (0.83 – 0.91)
    const newsOpacity = useTransform(scrollYProgress, [0.84, 0.87, 0.91, 0.93], [0, 1, 1, 0]);
    const newsYValue = useTransform(scrollYProgress, [0.84, 0.87], [100, 0]);

    // SCENE 9: CTA / App Download (0.93 – 1.0)
    const ctaOpacity = useTransform(scrollYProgress, [0.94, 0.96], [0, 1]);
    const ctaYValue = useTransform(scrollYProgress, [0.94, 0.96], [80, 0]);

    // Scroll progress indicator
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    // Derive pointer-events from opacity so invisible scenes don't steal clicks/hover
    const formPointer = useTransform(formOpacity, v => v > 0.05 ? 'auto' : 'none');
    const expPointer = useTransform(expOpacity, v => v > 0.05 ? 'auto' : 'none');
    const fleetPointer = useTransform(fleetOpacity, v => v > 0.05 ? 'auto' : 'none');
    const loyPointer = useTransform(loyOpacity, v => v > 0.05 ? 'auto' : 'none');
    const testPointer = useTransform(testOpacity, v => v > 0.05 ? 'auto' : 'none');
    const routePointer = useTransform(routeOpacity, v => v > 0.05 ? 'auto' : 'none');
    const newsPointer = useTransform(newsOpacity, v => v > 0.05 ? 'auto' : 'none');
    const ctaPointer = useTransform(ctaOpacity, v => v > 0.05 ? 'auto' : 'none');

    // Animated counter hook
    const useCounter = (end, opacity) => {
        const [val, setVal] = useState(0);
        useEffect(() => {
            return opacity.on('change', v => {
                if (v > 0.5) setVal(end);
                else setVal(0);
            });
        }, [end, opacity]);
        return val;
    };
    const statFlights = useCounter(850, fleetOpacity);
    const statDest = useCounter(120, fleetOpacity);
    const statPassengers = useCounter(42, fleetOpacity);
    const statOnTime = useCounter(98, fleetOpacity);

    return (
        <div ref={containerRef} className="relative h-[1400vh] bg-cosmic">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-aurora via-solar to-stellar z-[45]"
                style={{ width: progressWidth }}
            />

            {!ready && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic flex-col gap-6"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Plane className="w-12 h-12 text-aurora" />
                    </motion.div>
                    <div className="text-stardust font-ui text-sm tracking-widest uppercase">
                        Preparing Departure... {Math.round((loaded / FRAME_COUNT) * 100)}%
                    </div>
                    <div className="w-48 h-1 bg-nebula rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-aurora to-solar rounded-full"
                            style={{ width: `${(loaded / FRAME_COUNT) * 100}%` }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Sticky viewport container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden isolate">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover -z-20" style={{ filter: 'contrast(1.05) saturate(1.15) brightness(1.02)' }} />

                {/* Ambient gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic/50 via-transparent to-cosmic/30 pointer-events-none -z-10" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-aurora/[0.03] rounded-full blur-[150px] pointer-events-none -z-10 animate-float" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-solar/[0.03] rounded-full blur-[150px] pointer-events-none -z-10 animate-float-delayed" />

                {/* Scroll darkening overlay */}
                <motion.div
                    className="absolute inset-0 bg-cosmic pointer-events-none -z-10"
                    style={{ opacity: overlayOpacity }}
                />

                {/* --- SCENE 1: Brand Title --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
                >
                    <div className="flex flex-col items-center">
                        <motion.h1
                            className="text-3xl sm:text-5xl md:text-8xl font-heading font-bold text-stardust drop-shadow-2xl tracking-tighter text-center"
                            style={{ textShadow: '0 0 60px rgba(167,139,250,0.3)' }}
                        >
                            STARLIGHT AIRLINES
                        </motion.h1>
                        <p className="font-ui text-aurora uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-3 sm:mt-4 text-center text-xs sm:text-sm">Escape to Paradise</p>
                        <motion.div
                            className="mt-8 w-16 h-[2px] bg-gradient-to-r from-transparent via-aurora to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        />
                    </div>
                </motion.div>

                {/* --- SCENE 2: Search Form --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[10%] z-20 pointer-events-none"
                    style={{ opacity: formOpacity, y: formYValue, scale: formScale }}
                >
                    <motion.div className="bg-nebula/60 backdrop-blur-2xl border border-aurora/10 p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-[0_0_60px_rgba(167,139,250,0.08)] w-full max-w-4xl mx-4 transform-gpu" style={{ pointerEvents: formPointer }}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold mb-5 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-aurora via-stellar to-solar">Where to next?</h2>
                        <form
                            className="grid grid-cols-1 md:grid-cols-4 gap-5"
                            onSubmit={(e) => { e.preventDefault(); navigate('/search'); }}
                        >
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DEPARTURE</label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <input data-hover-type="TYPE" type="text" placeholder="NYC - New York" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust placeholder:text-comet/40 outline-none focus:border-aurora/50 focus:shadow-[0_0_12px_rgba(167,139,250,0.15)] transition-all placeholder:font-light" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DESTINATION</label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5 rotate-90" />
                                    <input data-hover-type="TYPE" type="text" placeholder="MLE - Maldives" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust placeholder:text-comet/40 outline-none focus:border-aurora/50 focus:shadow-[0_0_12px_rgba(167,139,250,0.15)] transition-all" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">DATES</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <input data-hover-type="DATES" type="text" placeholder="Nov 12 - Nov 19" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none focus:border-aurora/50 transition-all" readOnly />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">PASSENGERS</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <select data-hover-type="SELECT" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none appearance-none focus:border-aurora/50 transition-all">
                                        <option>2 Adults</option>
                                        <option>1 Adult</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-ui text-comet tracking-wider uppercase">CLASS</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/50 w-5 h-5" />
                                    <select data-hover-type="SELECT" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-stardust outline-none appearance-none focus:border-aurora/50 transition-all">
                                        <option>First Class</option>
                                        <option>Business</option>
                                        <option>Economy</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                data-hover-type="FLIGHT"
                                className="col-span-1 md:col-span-4 mt-4 py-5 rounded-2xl bg-gradient-to-r from-aurora to-aurora-deep hover:from-solar hover:to-aurora text-white font-ui font-semibold tracking-wider uppercase transition-all duration-500 shadow-[0_0_30px_rgba(167,139,250,0.3)] hover:shadow-[0_0_40px_rgba(251,146,60,0.4)] group"
                            >
                                <span className="group-hover:tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3">
                                    Search Flights <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    </motion.div>
                </motion.div>

                {/* --- SCENE 3: The Experience --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[10%] z-20 pointer-events-none"
                    style={{ opacity: expOpacity, y: expYValue }}
                >
                    <motion.div className="max-w-[1400px] w-full px-6 md:px-8" style={{ pointerEvents: expPointer }}>
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 w-full relative h-[400px] md:h-[500px] rounded-[32px] overflow-hidden group shadow-2xl" data-hover-type="EXPLORE">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: `url('${BASE}images/business_class.png')` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-cosmic/90 via-cosmic/20 to-transparent" />
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
                    </motion.div>
                </motion.div>

                {/* --- SCENE 4: Fleet & Stats --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[5%] z-20 pointer-events-none"
                    style={{ opacity: fleetOpacity, y: fleetYValue }}
                >
                    <motion.div className="max-w-6xl w-full px-6 md:px-8" style={{ pointerEvents: fleetPointer }}>
                        <div className="text-center mb-8 sm:mb-14">
                            <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-3 sm:mb-4 text-xs sm:text-sm">Our Fleet</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-6xl font-heading font-semibold text-stardust">Flying the Future</h3>
                            <p className="text-comet font-ui mt-4 max-w-2xl mx-auto leading-relaxed">The most modern fleet in the sky. Quiet cabins, panoramic windows, and zero-emission engines on every route.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                            {[
                                { icon: Plane, label: 'Daily Flights', value: statFlights, suffix: '+' },
                                { icon: Globe, label: 'Destinations', value: statDest, suffix: '+' },
                                { icon: Users, label: 'Million Passengers', value: statPassengers, suffix: 'M' },
                                { icon: Clock, label: 'On-Time Rate', value: statOnTime, suffix: '%' },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-nebula/50 backdrop-blur-xl border border-aurora/10 rounded-3xl p-8 text-center group hover:border-aurora/30 transition-all duration-500"
                                    whileHover={{ y: -6 }}
                                >
                                    <stat.icon className="w-8 h-8 text-aurora mx-auto mb-5 group-hover:text-solar transition-colors duration-300" />
                                    <div className="text-4xl md:text-5xl font-heading font-bold text-stardust mb-2">
                                        <motion.span>{stat.value}</motion.span>{stat.suffix}
                                    </div>
                                    <div className="font-ui text-xs tracking-widest uppercase text-comet">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-8 sm:mt-12 flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 justify-center items-center">
                            {['Boeing 787 Dreamliner', 'Airbus A350-1000', 'Boeing 777X', 'Airbus A321neo'].map((plane, idx) => (
                                <div key={idx} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 text-comet font-ui text-xs sm:text-sm tracking-wider hover:border-aurora/30 hover:text-stardust transition-all">
                                    {plane}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- SCENE 5: Loyalty Program --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[10%] z-20 pointer-events-none"
                    style={{ opacity: loyOpacity, y: loyYValue }}
                >
                    <motion.div className="max-w-6xl w-full px-6 md:px-8" style={{ pointerEvents: loyPointer }}>
                        <div className="bg-gradient-to-br from-nebula/90 to-cosmic/90 backdrop-blur-2xl border border-solar/15 p-6 sm:p-10 md:p-16 rounded-[24px] sm:rounded-[32px] flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16 relative overflow-hidden shadow-[0_0_60px_rgba(251,146,60,0.06)]">
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
                                        <div key={idx} className={`px-5 py-2 rounded-full text-sm font-ui tracking-wider border ${idx === 3 ? 'border-solar/40 text-solar bg-solar/10' : 'border-white/10 text-comet'}`}>
                                            {tier}
                                        </div>
                                    ))}
                                </div>
                                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-solar to-amber-400 hover:from-aurora hover:to-solar text-cosmic font-ui uppercase tracking-widest font-semibold transition-all duration-500 shadow-[0_0_20px_rgba(251,146,60,0.3)]" data-hover-type="JOIN">
                                    Join The Club
                                </button>
                            </div>
                            <div className="flex-1 w-full flex justify-center z-10 relative">
                                <img src={`${BASE}images/loyalty_card.png`} className="w-[80%] max-w-[400px] object-cover rounded-3xl animate-float shadow-2xl" alt="Loyalty Card" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- SCENE 6: Testimonials --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[5%] z-20 pointer-events-none"
                    style={{ opacity: testOpacity, y: testYValue }}
                >
                    <motion.div className="max-w-6xl w-full px-6 md:px-8" style={{ pointerEvents: testPointer }}>
                        <div className="text-center mb-14">
                            <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm">Traveler Stories</h2>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-semibold text-stardust">What Our Guests Say</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Elena S.', route: 'NYC → Tokyo', rating: 5, text: 'The Celestial Suite was beyond anything I\'ve experienced. Michelin-level dining at 40,000 feet — absolutely extraordinary.' },
                                { name: 'James P.', route: 'London → Maldives', rating: 5, text: 'From the premium lounge to the lie-flat beds, every moment felt like a five-star hotel. I won\'t fly any other airline.' },
                                { name: 'Aisha K.', route: 'Dubai → Paris', rating: 5, text: 'The crew remembered my name, my preferences, everything. It felt like having a personal concierge in the sky.' },
                            ].map((review, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-nebula/50 backdrop-blur-xl border border-aurora/10 rounded-3xl p-8 relative group hover:border-aurora/20 transition-all duration-500"
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
                    </motion.div>
                </motion.div>

                {/* --- SCENE 7: Popular Routes --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[5%] z-20 pointer-events-none"
                    style={{ opacity: routeOpacity, y: routeYValue }}
                >
                    <motion.div className="max-w-[1400px] w-full px-6 md:px-8" style={{ pointerEvents: routePointer }}>
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-aurora font-ui uppercase tracking-[0.3em] mb-4 text-sm">Trending Now</h2>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-stardust">Popular Routes</h3>
                            </div>
                            <button onClick={() => navigate('/destinations')} className="hidden md:flex items-center gap-3 text-stardust font-ui uppercase tracking-widest text-sm hover:text-aurora transition-colors group" data-hover-type="VIEW ALL">
                                All Routes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                            {[
                                { from: 'New York', to: 'London', price: '$449', time: '7h 15m', tag: 'Most Popular' },
                                { from: 'Tokyo', to: 'Singapore', price: '$389', time: '6h 40m', tag: 'Best Value' },
                                { from: 'Dubai', to: 'Maldives', price: '$299', time: '4h 20m', tag: 'Tropical' },
                                { from: 'Paris', to: 'Santorini', price: '$199', time: '3h 30m', tag: 'New Route' },
                            ].map((route, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-nebula/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 group hover:border-aurora/20 transition-all duration-500 cursor-pointer"
                                    data-hover-type="BOOK"
                                    whileHover={{ y: -6 }}
                                    onClick={() => navigate('/search')}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 rounded-full bg-aurora/10 text-aurora font-ui text-[10px] tracking-widest uppercase">{route.tag}</span>
                                        <Clock className="w-4 h-4 text-comet" />
                                    </div>
                                    <div className="space-y-1 mb-5">
                                        <div className="font-heading text-xl text-stardust">{route.from}</div>
                                        <div className="flex items-center gap-2 text-comet/40">
                                            <div className="w-2 h-2 rounded-full bg-aurora" />
                                            <div className="flex-1 h-px bg-gradient-to-r from-aurora/30 to-transparent" />
                                            <Plane className="w-4 h-4 text-aurora/50 rotate-90" />
                                            <div className="flex-1 h-px bg-gradient-to-l from-solar/30 to-transparent" />
                                            <div className="w-2 h-2 rounded-full bg-solar" />
                                        </div>
                                        <div className="font-heading text-xl text-stardust">{route.to}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-heading font-bold text-aurora">{route.price}</div>
                                            <div className="text-xs font-ui text-comet">one way</div>
                                        </div>
                                        <div className="text-xs font-ui text-comet tracking-wider">{route.time}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- SCENE 8: News & Offers --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pt-[10%] z-20 pointer-events-none"
                    style={{ opacity: newsOpacity, y: newsYValue }}
                >
                    <motion.div className="max-w-[1400px] w-full px-6 md:px-8" style={{ pointerEvents: newsPointer }}>
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-stardust">Latest Offers</h2>
                                <p className="font-ui text-aurora uppercase tracking-[0.2em] mt-3 text-sm">Curated just for you</p>
                            </div>
                            <button className="hidden md:flex items-center gap-3 text-stardust font-ui uppercase tracking-widest text-sm hover:text-aurora transition-colors group" data-hover-type="VIEW ALL">
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
                                    <div className="h-56 md:h-64 rounded-2xl overflow-hidden mb-5 relative border border-white/5 group-hover:border-aurora/20 transition-colors">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110" style={{ backgroundImage: `url('${offer.img}')` }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-cosmic/60 to-transparent" />
                                    </div>
                                    <div className="font-ui text-xs text-aurora tracking-widest uppercase mb-3 border-l-2 border-aurora pl-3">Offer</div>
                                    <h3 className="font-heading text-xl md:text-2xl text-stardust mb-2 group-hover:text-aurora transition-colors">{offer.title}</h3>
                                    <p className="font-ui text-comet text-sm leading-relaxed">{offer.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- SCENE 9: CTA / Download App --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    style={{ opacity: ctaOpacity, y: ctaYValue }}
                >
                    <motion.div className="max-w-5xl w-full px-6 md:px-8" style={{ pointerEvents: ctaPointer }}>
                            <div className="bg-gradient-to-br from-aurora/10 via-nebula/80 to-stellar/10 backdrop-blur-2xl border border-aurora/15 rounded-[28px] sm:rounded-[40px] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_80px_rgba(167,139,250,0.08)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-aurora/5 rounded-full blur-[120px]" />
                            <div className="relative z-10">
                                <motion.div
                                    className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-aurora to-aurora-deep flex items-center justify-center shadow-[0_0_40px_rgba(167,139,250,0.3)]"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Plane className="w-10 h-10 text-white -rotate-45" />
                                </motion.div>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-stardust mb-4 sm:mb-6">Ready for Takeoff?</h2>
                                <p className="text-comet font-ui leading-relaxed max-w-2xl mx-auto mb-10 text-lg">
                                    Download the Starlight app for exclusive mobile-only fares, real-time flight tracking, and instant boarding passes.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                    <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-aurora to-aurora-deep hover:from-solar hover:to-aurora text-white font-ui font-semibold tracking-wider uppercase transition-all duration-500 shadow-[0_0_30px_rgba(167,139,250,0.3)] group flex items-center gap-3" data-hover-type="DOWNLOAD">
                                        <Download className="w-5 h-5" />
                                        <span>Download App</span>
                                    </button>
                                    <button onClick={() => navigate('/search')} className="px-10 py-5 rounded-2xl border border-aurora/30 text-stardust font-ui font-semibold tracking-wider uppercase hover:bg-aurora/10 hover:border-aurora/50 transition-all duration-500 group flex items-center gap-3" data-hover-type="BOOK NOW">
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
                    </motion.div>
                </motion.div>

                {/* Scroll indicator at bottom */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                >
                    <span className="font-ui text-xs tracking-[0.3em] uppercase text-comet/60">Scroll to explore</span>
                    <motion.div
                        className="w-5 h-8 rounded-full border border-aurora/30 flex justify-center pt-2"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-1 h-2 bg-aurora rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

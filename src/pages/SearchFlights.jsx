import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, Filter, Clock, ArrowRight } from 'lucide-react';

const FLIGHTS = [
    { id: 1, airline: 'Singapore Airlines', dep: 'NYC 08:00', arr: 'MLE 10:30 (+1)', duration: '16h 30m', stops: '1 Stop', price: '$4,500', class: 'First Class' },
    { id: 2, airline: 'Emirates', dep: 'NYC 12:45', arr: 'MLE 15:20 (+1)', duration: '18h 35m', stops: '1 Stop', price: '$4,200', class: 'First Class' },
    { id: 3, airline: 'Qatar Airways', dep: 'NYC 22:30', arr: 'MLE 08:15 (+2)', duration: '20h 45m', stops: '2 Stops', price: '$3,800', class: 'First Class' },
];

export default function SearchFlights() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen pt-32 px-4 md:px-8 pb-16 w-full max-w-[1600px] mx-auto relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-solar/5 rounded-full blur-[100px] pointer-events-none" />

            <h1 className="text-4xl md:text-6xl font-heading font-semibold mb-12 flex items-center gap-4 md:gap-6">
                <span className="text-stardust">NYC</span>
                <ArrowRight className="text-aurora w-8 h-8 md:w-10 md:h-10" />
                <span className="text-stardust">MLE</span>
                <span className="text-sm md:text-xl text-comet font-ui uppercase tracking-widest ml-4 mt-2 border-l border-white/20 pl-4">Nov 12, 2 Passengers</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                {/* Filters Panel */}
                <div className="lg:w-1/4 w-full">
                    <div className="bg-nebula/60 backdrop-blur-md border border-aurora/10 p-8 rounded-[24px] sticky top-32">
                        <div className="flex items-center gap-3 mb-8">
                            <Filter className="text-aurora w-5 h-5" />
                            <h3 className="font-heading text-xl text-stardust">Filters</h3>
                        </div>

                        <div className="space-y-8 font-ui">
                            <div>
                                <h4 className="text-comet text-xs tracking-widest uppercase mb-4">Stops</h4>
                                <div className="space-y-3">
                                    {['Non-stop', '1 Stop', '2+ Stops'].map((stop, i) => (
                                        <label key={stop} className="flex items-center gap-3 cursor-pointer group" data-hover-type="SELECT">
                                            <input type="checkbox" defaultChecked={i > 0} className="accent-[#A78BFA] h-5 w-5 rounded bg-cosmic border-white/20" />
                                            <span className="text-stardust opacity-80 group-hover:opacity-100 transition-opacity">{stop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-comet text-xs tracking-widest uppercase mb-4">Airlines</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Emirates', price: '$4.2k' },
                                        { name: 'Singapore Airlines', price: '$4.5k' },
                                        { name: 'Qatar Airways', price: '$3.8k' }
                                    ].map(a => (
                                        <label key={a.name} className="flex items-center justify-between cursor-pointer group" data-hover-type="SELECT">
                                            <span className="text-stardust opacity-80 group-hover:opacity-100 transition-opacity">{a.name}</span>
                                            <span className="text-comet/50 text-xs">from {a.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flight Results */}
                <div className="lg:w-3/4 flex flex-col gap-6">
                    {FLIGHTS.map((flight, idx) => (
                        <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.12, duration: 0.5 }}
                            onClick={() => navigate('/book')}
                            data-hover-type="SELECT"
                            className="group bg-nebula/50 backdrop-blur-md border border-white/[0.06] hover:border-aurora/40 hover:bg-aurora/[0.03] p-6 md:p-8 rounded-[24px] cursor-pointer transition-all duration-500 overflow-hidden relative"
                        >
                            {/* Shine sweep on hover */}
                            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />

                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 relative z-10">

                                {/* Airline & Class */}
                                <div className="w-full md:w-1/4">
                                    <div className="text-aurora font-heading text-lg md:text-xl mb-1">{flight.airline}</div>
                                    <div className="text-xs font-ui text-solar tracking-widest uppercase">{flight.class}</div>
                                </div>

                                {/* Timeline */}
                                <div className="flex-1 flex justify-between items-center relative w-full font-ui">
                                    <div className="text-center">
                                        <div className="text-xl md:text-2xl font-semibold text-stardust">{flight.dep.split(' ')[1]}</div>
                                        <div className="text-sm text-comet">{flight.dep.split(' ')[0]}</div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center mx-4 md:mx-8">
                                        <div className="flex items-center justify-center w-full gap-2 text-comet mb-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs tracking-widest uppercase">{flight.duration}</span>
                                        </div>
                                        <div className="w-full relative flex items-center">
                                            <div className="w-2 h-2 rounded-full border-2 border-aurora bg-cosmic z-10" />
                                            <div className="flex-1 h-[1px] bg-gradient-to-r from-aurora/40 via-white/10 to-aurora/40 relative">
                                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-aurora w-5 h-5" />
                                            </div>
                                            <div className="w-2 h-2 rounded-full border-2 border-aurora bg-cosmic z-10" />
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest text-aurora/50 mt-2">{flight.stops}</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-xl md:text-2xl font-semibold text-stardust">{flight.arr.split(' ')[1]}</div>
                                        <div className="text-sm text-comet">{flight.arr.split(' ')[0]} <span className="text-stellar">{flight.arr.split(' ')[2]}</span></div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="w-full md:w-1/4 text-right flex flex-col items-end">
                                    <div className="text-2xl md:text-3xl font-heading text-stardust">{flight.price}</div>
                                    <div className="text-xs text-comet font-ui tracking-wide mb-4">per passenger</div>
                                    <button className="py-2.5 px-6 rounded-full bg-aurora/10 hover:bg-aurora hover:text-cosmic text-stardust font-ui text-sm uppercase tracking-widest transition-all duration-300 border border-aurora/20 hover:border-aurora hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]">
                                        Book Flight
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

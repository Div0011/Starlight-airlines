import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Luggage } from 'lucide-react';

const SEATS = Array.from({ length: 48 }, (_, i) => ({
    id: `${Math.floor(i / 4) + 1}${['A', 'B', 'C', 'D'][i % 4]}`,
    status: Math.random() > 0.7 ? 'occupied' : Math.random() > 0.8 ? 'premium' : 'available'
}));

export default function BookingDetails() {
    const [step, setStep] = useState(1);
    const [selectedSeat, setSelectedSeat] = useState(null);

    const renderSeatMap = () => (
        <div className="flex flex-col items-center gap-12" style={{ perspective: '1000px' }}>
            <div
                className="grid grid-cols-5 gap-y-4 gap-x-2 w-full max-w-sm"
                style={{ transform: 'rotateX(30deg)', transformStyle: 'preserve-3d' }}
            >
                {SEATS.map((seat, idx) => {
                    const isAisle = idx % 4 === 1;
                    return (
                        <div key={seat.id} className="contents">
                            <button
                                disabled={seat.status === 'occupied'}
                                onClick={() => setSelectedSeat(seat.id)}
                                data-hover-type={seat.status !== 'occupied' ? 'SELECT' : null}
                                className={`
                                    w-10 h-12 sm:w-12 sm:h-14 rounded-t-xl rounded-b-md relative shadow-lg transform-gpu transition-all duration-300
                                    ${isAisle ? 'mr-4 sm:mr-8' : ''}
                                    ${selectedSeat === seat.id
                                        ? 'bg-aurora text-white scale-110 !z-20 -translate-y-4 shadow-aurora/40 shadow-xl'
                                        : seat.status === 'occupied'
                                            ? 'bg-white/10 opacity-50 cursor-not-allowed'
                                            : seat.status === 'premium'
                                                ? 'bg-solar/20 border-solar/40 border hover:bg-solar/30'
                                                : 'bg-white/10 hover:bg-white/20'
                                    }
                                `}
                                style={{ transformStyle: 'preserve-3d' }}
                                aria-label={`Seat ${seat.id}${seat.status === 'occupied' ? ' (occupied)' : seat.status === 'premium' ? ' (premium)' : ''}`}
                            >
                                <div className="absolute top-1 -left-[2px] w-[2px] h-8 bg-black/20 rounded-full" />
                                <div className="absolute top-1 -right-[2px] w-[2px] h-8 bg-black/20 rounded-full" />
                                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full ${selectedSeat === seat.id ? 'bg-aurora/40' : 'bg-white/10'}`} />
                                <span className="text-xs font-ui mt-6 block">{seat.id}</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-6 md:gap-8 text-xs font-ui uppercase tracking-widest text-comet flex-wrap justify-center">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/10 border border-transparent" /> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-solar/20 border border-solar/40" /> Premium</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/5" /> Occupied</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-aurora" /> Selected</div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 px-4 md:px-8 pb-16 w-full max-w-[1200px] mx-auto relative"
        >
            {/* Background glows */}
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-aurora/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Flight Summary Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 border-b border-white/10 pb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-heading font-semibold text-stardust">Booking Details</h1>
                    <p className="text-comet font-ui uppercase tracking-widest text-sm mt-3">NYC to MLE &bull; Nov 12 &bull; Singapore Airlines</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl md:text-4xl font-heading text-stardust">$4,500</div>
                    <p className="text-comet font-ui uppercase tracking-widest text-xs mt-1">Total for 2 Passengers</p>
                </div>
            </div>

            {/* Progress Steps */}
                <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 sm:mb-16 relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
                <div className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-aurora to-stellar transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />

                {['Passenger Info', 'Seat Selection', 'Add-ons', 'Payment'].map((label, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-ui text-sm transition-all duration-300 ${step > idx
                            ? 'bg-aurora text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                            : step === idx + 1
                                ? 'bg-cosmic border-2 border-aurora text-aurora'
                                : 'bg-cosmic border border-white/10 text-comet'
                            }`}>
                            {idx + 1}
                        </div>
                        <span className="text-[10px] uppercase font-ui tracking-widest text-comet hidden md:block">
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass-card rounded-[28px] p-4 sm:p-6 md:p-12 lg:p-16 min-h-[400px] sm:min-h-[500px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-heading font-semibold mb-8 flex items-center gap-3"><User className="text-aurora" /> Passenger Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-ui">
                                <input type="text" placeholder="First Name" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 px-4 sm:px-6 text-stardust focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all" data-hover-type="TYPE" />
                                <input type="text" placeholder="Last Name" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 px-4 sm:px-6 text-stardust focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all" data-hover-type="TYPE" />
                                <input type="email" placeholder="Email Address" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 px-4 sm:px-6 text-stardust focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all" data-hover-type="TYPE" />
                                <input type="text" placeholder="Passport Number" className="w-full bg-cosmic/60 border border-white/10 rounded-2xl py-3 sm:py-4 px-4 sm:px-6 text-stardust focus:border-aurora focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all" data-hover-type="TYPE" />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col items-center">
                            <h2 className="text-2xl font-heading font-semibold mb-12 self-start flex items-center gap-3"><div className="w-2 h-2 rounded bg-aurora" /> Select Your Seat</h2>
                            {renderSeatMap()}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-heading font-semibold mb-8 flex items-center gap-3"><Luggage className="text-aurora" /> Extras & Add-ons</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'Extra Checked Baggage (+23kg)', price: '$85', desc: 'Add more luggage for your journey' },
                                    { title: 'Lounge Access', price: '$120', desc: 'Relax in our premium lounge before flight' },
                                    { title: 'Gourmet Meal Upgrade', price: '$45', desc: "Pre-order from our chef's special menu" }
                                ].map((addon, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 md:p-6 rounded-2xl border border-white/10 bg-cosmic/40 hover:bg-aurora/[0.06] hover:border-aurora/30 transition-all cursor-pointer group" data-hover-type="SELECT">
                                        <div className="flex items-center gap-4 md:gap-6">
                                <input type="checkbox" className="w-5 h-5 accent-[#3B82F6] bg-transparent" />
                                            <div>
                                                <h3 className="font-heading text-lg md:text-xl text-stardust">{addon.title}</h3>
                                                <p className="text-comet text-sm font-ui mt-1">{addon.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-aurora font-ui text-lg md:text-xl font-medium">{addon.price}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-heading font-semibold mb-8 flex items-center gap-3"><CreditCard className="text-aurora" /> Secure Payment</h2>
                            <div className="bg-gradient-to-br from-nebula/80 to-cosmic/80 p-8 rounded-3xl border border-aurora/10 max-w-lg mx-auto">
                                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-aurora/20 via-aurora-deep/10 to-cosmic border border-aurora/20 p-6 mb-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-aurora/10 rounded-full blur-2xl" />
                                    <div className="flex justify-between items-center text-stardust/80 font-ui tracking-widest text-sm uppercase relative z-10">
                                        <span>Credit Card</span>
                                        <span>VISA</span>
                                    </div>
                                    <div className="font-heading text-2xl tracking-[0.2em] relative z-10 text-stardust/90">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</div>
                                    <div className="flex justify-between font-ui text-xs text-comet relative z-10 uppercase tracking-widest">
                                        <span>Card Holder<br /><span className="text-stardust font-medium">JANE DOE</span></span>
                                        <span>Expires<br /><span className="text-stardust font-medium">12/28</span></span>
                                    </div>
                                </div>

                                <button
                                    className="btn-wind w-full py-4 rounded-xl bg-gradient-to-r from-aurora to-aurora-deep hover:from-aurora-deep hover:to-aurora text-white font-ui font-semibold uppercase tracking-widest transition-all duration-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(29,78,216,0.3)]"
                                    data-hover-type="CONFIRM"
                                >
                                    Confirm & Pay $4,500
                                </button>
                                <div className="text-center text-xs font-ui text-comet/50 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                    <CreditCard className="w-3 h-3" /> Secure Encrypted Connection
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between mt-8">
                {step > 1 ? (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="px-8 py-3 rounded-full border border-white/10 text-stardust uppercase text-xs tracking-widest font-ui hover:bg-aurora/10 hover:border-aurora transition-all"
                        data-hover-type="BACK"
                    >
                        Go Back
                    </button>
                ) : <div />}

                {step < 4 && (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="btn-wind px-8 py-3 rounded-full bg-gradient-to-r from-aurora to-aurora-deep text-white uppercase text-xs tracking-widest font-ui transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)]"
                        data-hover-type="NEXT"
                    >
                        Continue
                    </button>
                )}
            </div>
        </motion.div>
    );
}

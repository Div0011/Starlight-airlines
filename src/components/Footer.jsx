import { Link } from 'react-router-dom';
import { Plane, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const FOOTER_LINKS = {
    'Fly With Us': [
        { name: 'Book Flights', path: '/search' },
        { name: 'Destinations', path: '/' },
        { name: 'Flight Status', path: '/' },
        { name: 'Check-In Online', path: '/' },
        { name: 'Manage Booking', path: '/' },
    ],
    'Experience': [
        { name: 'First Class', path: '/' },
        { name: 'Business Class', path: '/' },
        { name: 'Economy Plus', path: '/' },
        { name: 'Inflight Dining', path: '/' },
        { name: 'Lounges', path: '/' },
    ],
    'Loyalty': [
        { name: 'Starlight Rewards', path: '/' },
        { name: 'Earn Miles', path: '/' },
        { name: 'Redeem Miles', path: '/' },
        { name: 'Tier Status', path: '/' },
        { name: 'Partner Airlines', path: '/' },
    ],
    'Company': [
        { name: 'About Us', path: '/' },
        { name: 'Careers', path: '/' },
        { name: 'Newsroom', path: '/' },
        { name: 'Sustainability', path: '/' },
        { name: 'Contact', path: '/' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-transparent via-[#0B1629]/80 to-[#0B1629] border-t border-white/5 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-aurora/[0.02] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-solar/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-10">
                {/* Top section */}
                <div className="flex flex-col lg:flex-row gap-16 mb-16">
                    {/* Brand column */}
                    <div className="lg:w-[320px] shrink-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora to-aurora-deep flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white -rotate-45" />
                            </div>
                            <span className="font-heading text-xl font-semibold text-stardust tracking-tight">Starlight Airlines</span>
                        </div>
                        <p className="text-comet font-ui text-sm leading-relaxed mb-8">
                            Redefining luxury travel since 2019. Connecting 120+ destinations across 6 continents with the world&apos;s most modern fleet.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-comet/70 font-ui text-sm">
                                <MapPin className="w-4 h-4 text-aurora/50 shrink-0" />
                                <span>Starlight Tower, JFK International, NY 11430</span>
                            </div>
                            <div className="flex items-center gap-3 text-comet/70 font-ui text-sm">
                                <Phone className="w-4 h-4 text-aurora/50 shrink-0" />
                                <span>+1 (800) STAR-FLY</span>
                            </div>
                            <div className="flex items-center gap-3 text-comet/70 font-ui text-sm">
                                <Mail className="w-4 h-4 text-aurora/50 shrink-0" />
                                <span>hello@starlightairlines.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Links grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                            <div key={category}>
                                <h4 className="font-heading text-sm font-semibold text-stardust mb-5 tracking-wide">{category}</h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.path}
                                                className="text-comet/60 font-ui text-sm hover:text-aurora transition-colors duration-300"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                    <div className="flex-1">
                        <h3 className="font-heading text-2xl font-semibold text-stardust mb-2">Stay in the loop</h3>
                        <p className="text-comet font-ui text-sm">Get exclusive deals, travel tips, and early access to new routes.</p>
                    </div>
                    <form className="flex w-full md:w-auto gap-3" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 md:w-72 bg-cosmic/60 border border-white/10 rounded-xl py-3 px-5 text-stardust placeholder:text-comet/40 outline-none focus:border-aurora font-ui text-sm transition-all"
                        />
                        <button className="btn-wind px-6 py-3 rounded-xl bg-gradient-to-r from-aurora to-aurora-deep text-white font-ui font-semibold text-sm tracking-wider uppercase hover:from-aurora-deep hover:to-aurora transition-all duration-500 shrink-0">
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
                    <div className="text-comet/40 font-ui text-xs tracking-wider">
                        &copy; 2026 Starlight Airlines. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-comet/40 font-ui text-xs hover:text-aurora transition-colors">Privacy</a>
                        <a href="#" className="text-comet/40 font-ui text-xs hover:text-aurora transition-colors">Terms</a>
                        <a href="#" className="text-comet/40 font-ui text-xs hover:text-aurora transition-colors">Cookies</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {[Instagram, Twitter, Youtube].map((Icon, idx) => (
                            <a key={idx} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-comet/50 hover:text-aurora hover:border-aurora transition-all duration-300">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

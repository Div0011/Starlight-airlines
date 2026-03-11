import React, { Suspense, useEffect, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';

const SearchFlights = lazy(() => import('./pages/SearchFlights'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));
const Destinations = lazy(() => import('./pages/Destinations'));

// Scroll to top on every route change
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

// Helper for route transitions
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#0B1629]">
                    <Plane className="w-10 h-10 text-aurora animate-pulse" />
                </div>
            }>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchFlights />} />
                    <Route path="/book" element={<BookingDetails />} />
                    <Route path="/destinations" element={<Destinations />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

export default function App() {
    return (
        <Router>
            <div className="relative min-h-screen">
                <ScrollToTop />
                <CustomCursor />

                {/* Wind background lines */}
                <div className="wind-bg">
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                    <div className="wind-line" />
                </div>



                {/* Center watermark */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[2]">
                    <Plane className="w-64 h-64 sm:w-80 sm:h-80 text-aurora/[0.03] -rotate-45 transform-gpu" />
                </div>

                <Navigation />
                <AnimatedRoutes />
                <Footer />
            </div>
        </Router>
    );
}

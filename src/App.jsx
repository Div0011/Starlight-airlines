import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchFlights from './pages/SearchFlights';
import BookingDetails from './pages/BookingDetails';
import Destinations from './pages/Destinations';

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
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchFlights />} />
                <Route path="/book" element={<BookingDetails />} />
                <Route path="/destinations" element={<Destinations />} />
            </Routes>
        </AnimatePresence>
    );
};

export default function App() {
    return (
        <Router>
            <div className="relative min-h-screen">
                <ScrollToTop />
                <CustomCursor />
                <Navigation />
                <AnimatedRoutes />
                <Footer />
            </div>
        </Router>
    );
}

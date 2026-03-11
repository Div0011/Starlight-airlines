/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmic: '#0A0E1A',
                nebula: '#111827',
                aurora: '#3B82F6',
                'aurora-deep': '#1D4ED8',
                solar: '#60A5FA',
                stellar: '#06B6D4',
                stardust: '#E8EDF5',
                comet: '#94A3B8',
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                ui: ['Manrope', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'slide-up': 'slide-up 0.6s ease-out forwards',
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'wind-1': 'wind-drift 8s linear infinite',
                'wind-2': 'wind-drift 12s linear 2s infinite',
                'wind-3': 'wind-drift 10s linear 5s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)' },
                    '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'wind-drift': {
                    '0%': { transform: 'translateX(-100%) translateY(0) rotate(-8deg)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateX(100vw) translateY(-30px) rotate(-8deg)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}

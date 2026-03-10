/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmic: '#020617',
                nebula: '#0F172A',
                aurora: '#A78BFA',
                'aurora-deep': '#7C3AED',
                solar: '#FB923C',
                stellar: '#38BDF8',
                stardust: '#F8FAFC',
                comet: '#94A3B8',
            },
            fontFamily: {
                heading: ['Sora', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                ui: ['"Space Grotesk"', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'slide-up': 'slide-up 0.6s ease-out forwards',
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(167, 139, 250, 0.5)' },
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
            },
        },
    },
    plugins: [],
}

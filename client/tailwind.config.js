/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                muted: 'hsl(var(--muted))',
                'muted-foreground': 'hsl(var(--muted-foreground))',
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    secondary: 'hsl(var(--accent-secondary))',
                },
                border: 'hsl(var(--border))',
                card: 'hsl(var(--card))',
            },
            fontFamily: {
                display: ['Calistoga', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                'rotate-slow': 'rotateSlow 60s linear infinite',
                'bob': 'bob 5s ease-in-out infinite',
                'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(28px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                rotateSlow: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                bob: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.3)' },
                },
            },
            boxShadow: {
                'accent': '0 4px 14px rgba(0, 82, 255, 0.25)',
                'accent-lg': '0 8px 24px rgba(0, 82, 255, 0.35)',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}




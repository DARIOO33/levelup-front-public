/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)', 'cursive'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        purple: {
          50:  '#f5f0ff', 100: '#ede5ff', 200: '#d9c9ff', 300: '#bc9dff',
          400: '#9c6aff', 500: '#7c3aff', 600: '#6916ff', 700: '#5800eb',
          800: '#4900c4', 900: '#3b009e', 950: '#240068',
        },
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan':       'scan 8s linear infinite',
        'slide-up':   'slideUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        'gradient':   'gradientShift 4s ease infinite',
        'marquee':    'marquee 40s linear infinite',
      },
      keyframes: {
        float:         { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGlow:     { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,255,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(124,58,255,0.8),0 0 80px rgba(124,58,255,0.3)' } },
        scan:          { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        slideUp:       { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:        { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        marquee:       { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};

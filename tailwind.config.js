/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      mobile: '360px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 5s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss/plugin')(function ({ addUtilities }) {
      addUtilities({
        // extending tailwind utils using plugins
        '.appearance-textfield': {
          // this doesn't work on chrome yet
          '-webkit-appearance': 'none',
          margin: 0,
          //  this only works on mozilla
          // order/precedence matters | -moz-appearance must be last
          '-moz-appearance': 'textfield',
        },
      });
    }),
  ],
};

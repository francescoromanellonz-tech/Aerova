/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand guide approved palette */
        obsidian: '#1A1A1B',       /* Obsidian Matte */
        sage: '#8DA399',           /* Morning Sage */
        gold: '#D4AF37',           /* Champagne Gold */
        sky: '#F0F4F8',            /* Light background */
        slate: '#334155',          /* Slate Charcoal */
        atmosphere: '#B0BEC5',     /* Atmosphere Blue */
      },
      fontFamily: {
        prata: ['Cormorant Garamond', 'Georgia', 'serif'],
        inter: ['Nunito', 'DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        airy: '0.15em',
        serif: '0.03em',
        viet: '0.28em',
      },
      spacing: {
        'section': '120px',
      },
    },
  },
  plugins: [],
};

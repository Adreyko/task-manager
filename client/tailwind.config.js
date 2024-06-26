/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'bg-color': 'var(--bg-color)',
        'inverted-primary-color': 'var(--inverted-primary-color)',
        'inverted-bg-color': 'var(--inverted-bg-color)',
      },
      height: {
        'navbar-height': 'var(--navbar-height)',
      },
    },
  },
  plugins: [],
};

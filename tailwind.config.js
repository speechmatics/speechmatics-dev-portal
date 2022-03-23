const themeColors = require('./theme-colors.json');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
    },
    extend: {
      boxShadow: {
        DEFAULT: '2px 2px 4px rgba(38, 50, 67, 0.2)',
        'md': '4px 4px 10px rgba(38, 50, 67, 0.2)',
        'lg': '8px 8px 16px rgba(38, 50, 67, 0.2)',
      },
      colors: {
        ...themeColors
      },
    },
  },
  plugins: [],
}

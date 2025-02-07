module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#000057',
        'dark-blue-600': '#000080', // Darker shade for hover state
      },
      borderRadius: {
        '3xl': '1.5rem', // Add a custom value for rounded corners
      },
    },
  },
  plugins: [],
};

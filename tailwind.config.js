module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}', // For the main App file
    './app/**/*.{js,jsx,ts,tsx}', // For all files inside the app folder
    './components/**/*.{js,jsx,ts,tsx}', // For all files inside the components folder
  ],
  theme: {
    colors: {
      green: '#12BDAC',
      'dark-green': '#0BA192',
    },
    extend: {},
  },
  plugins: [],
};

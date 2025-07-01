/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primaryColor":"#FF8E26",
        "secondaryColor":"#0C3DC0"
      },
      fontFamily:{
        "arabic":"Cairo, sans-serif"
      }
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.scroll-bar::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
          'background-color': '#F5F5F5',
        },
        '.scroll-bar::-webkit-scrollbar': {
          'width': '5px',
          'background-color': '#F5F5F5',
        },
        '.scroll-bar::-webkit-scrollbar-thumb': {
          'background-color': '#4399F8',
          'border': '2px solid #4399F8',
          'border-radius':'10px',
          'height':'30%',
        },
        '@supports selector(::-webkit-scrollbar)': {
          '.scroll-box::-webkit-scrollbar': {
            'background': 'aquamarine'
          }
        },
          '.scroll-box::-webkit-scrollbar-thumb': {
            'background': 'cornflowerblue'
          }
      });
    },
    
  ],
}


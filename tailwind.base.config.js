/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/layouts/**/*.pug",
    "./src/views/partials/**/*.pug",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
        fontSize: {
        'xxs': '10px', 
        'xl': '18px', '2xl': '20px', '3xl': '22px', '4xl': '24px',
        '5xl': '26px', '7xl': '32px', '9xl': '44px',
      },
      colors: {
        'brand-red': '#a80000',
        'ink': '#292A2B',
        'vanilla': '#fffbec',
        'bone':'#f6f6f6',
        'mist':'#c0c0da',
        'color-pagination':'#8b8b9f',
        'color-whatsapp':'#2ac108',
        'platinium' :'#d3d3d3',
      },
    },
  },
  plugins: [],
}

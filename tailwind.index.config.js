/** @type {import('tailwindcss').Config} */
const baseConfig = require('./tailwind.base.config')

module.exports = {
  ...baseConfig,

  content: [
    ...baseConfig.content,
    "./src/views/pages/index.pug",
    "./src/scripts/index.js",
  ],

  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      ...baseConfig.theme.extend,

      // index’e özel ekler
    },
  },

  plugins: [
    ...(baseConfig.plugins || []),
  ],
}

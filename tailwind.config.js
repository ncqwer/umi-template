module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {},
  antd: {},
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.tsx',
    './src/**/*.jsx',
  ],
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
};

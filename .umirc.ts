import { defineConfig } from '@umijs/max';

export default defineConfig({
  tailwindcss: {},
  // extraPostCSSPlugins: [
  //   require('postcss-import'),
  //   // eslint-disable-next-line
  //   require('tailwindcss'),
  // ],
  antd: {
    // configProvider
    configProvider: {},
    // themes
    dark: false,
    compact: true,
    // babel-plugin-import
    import: true,
    // less or css, default less
    style: 'css',
  },
  npmClient: 'yarn',
  // publicPath:
  //   process.env.NODE_ENV === 'production'
  //     ? process.env.PUBLIC_PATH || '/'
  //     : '/',
});

// export default {
//   npmClient: 'yarn',
//   tailwindcss: {},
//   antd: {},
// };

import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {},
  history: { type: 'browser' },
  fastRefresh: {},
  //other umi configs
  extraPostCSSPlugins: [
    require('postcss-import'),
    // eslint-disable-next-line
    require('tailwindcss'),
  ],
  publicPath:
    process.env.NODE_ENV === 'production'
      ? process.env.PUBLIC_PATH || '/'
      : '/',
});

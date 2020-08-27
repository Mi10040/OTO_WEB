import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme: {
    '@primary-r': '000',
    '@primary-g': '000',
    '@primary-b': '255',
  },
});

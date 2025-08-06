import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner = `/*!
 * Tron Component
 * (c) 2024 Nelson M
 * MIT
 */`;

export default [
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/tron-component.esm.js',
      format: 'es',
      banner
    },
    plugins: [nodeResolve()]
  },
  
  // UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/tron-component.js',
      format: 'umd',
      name: 'TronComponent',
      banner
    },
    plugins: [nodeResolve()]
  },
  
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/tron-component.min.js',
      format: 'umd',
      name: 'TronComponent',
      banner
    },
    plugins: [
      nodeResolve(),
      terser({
        format: {
          comments: /^!/
        }
      })
    ]
  }
];
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner = `/*!
 * Tron Component v1.0.0
 * Ultra-simple reactive web component library
 * (c) 2024 Nelson M
 * Released under the MIT License
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
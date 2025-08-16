import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const banner = '/*! @nelsondev/component v1.0.6 - Ultra-lightweight web component library */';

export default [
	// UMD build for browsers
	{
		input: 'src/index.js',
		output: {
			file: 'dist/tron-component.js',
			format: 'umd',
			name: 'TronComponent',
			banner,
			sourcemap: true
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			commonjs()
		]
	},

	// ES Module build
	{
		input: 'src/index.js',
		output: {
			file: 'dist/tron-component.esm.js',
			format: 'es',
			banner,
			sourcemap: true
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			commonjs()
		]
	},

	// Minified UMD build
	{
		input: 'src/index.js',
		output: {
			file: 'dist/tron-component.min.js',
			format: 'umd',
			name: 'TronComponent',
			banner,
			sourcemap: true
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			commonjs(),
			terser({
				format: {
					comments: false,
					preamble: banner
				}
			})
		]
	}
];
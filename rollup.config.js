import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/tron-component.min.js',
        format: 'umd',
        name: 'TronComponent',
        banner: '/*! Tron Component Bundle */',
    },
    context: 'window',
    plugins: [
        postcss({
            extract: false,
            inject: true,
            minimize: true
        }),
        nodeResolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs({
            include: ['node_modules/**'],
            transformMixedEsModules: true
        }),
        terser({
            format: {
                comments: false
            }
        })
    ]
};
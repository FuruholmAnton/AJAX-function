import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import packageJson from './package.json';
import serve from 'rollup-plugin-serve';

const name = packageJson.name;

let config;

if (process.env.SERVE == 'dev') {
    config = {
        input: 'docs/script.js',
        output: {
            file: 'docs/dist/script.es5.js',
            format: 'es',
        },
        plugins: [
            serve('docs'),
        ]
    }
} else {
    config = {
        input: name + '.js',
        output: {
            file: name + '.es5.js', // equivalent to --output
            format: 'iife',
            name: 'ajax'
        },
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**', // only transpile our source code
            }),
            uglify(),
        ],
    }
    
    if (process.env.BUILD == 'es') {
        config.output = {
            file: name + '.min.js', // equivalent to --output
            format: 'es',
        };
    } else if (process.env.BUILD == 'cjs') {
        config.output = {
            file: name + '.cjs.js', // equivalent to --output
            format: 'cjs',
            // exports: 'named',
        };
    }
}



export default config;

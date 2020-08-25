import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';


export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/cjs/index.js', format: 'cjs' },
    { file: 'dist/es/index.js', format: 'es'  }
    ],
  plugins: [
    localResolve(),
    resolve({ browser: true }),
    commonjs(),
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    //terser()
  ]
};

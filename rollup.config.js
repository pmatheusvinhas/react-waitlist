import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';

// Read package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Common plugins configuration
const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  postcss({
    extensions: ['.css'],
    inject: true, // Inject CSS into the bundle
    extract: false, // Don't extract CSS to a separate file
    minimize: true, // Minify CSS
  }),
  typescript({ tsconfig: './tsconfig.json' }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  }),
];

// External dependencies
const external = ['react', 'react-dom', 'resend'];

export default [
  // Main package
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
    ],
    plugins,
    external,
  },
  // Server subpackage
  {
    input: 'src/server.ts',
    output: [
      {
        file: 'dist/server.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
      {
        file: 'dist/server.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
    ],
    plugins,
    external,
  },
  // Client subpackage
  {
    input: 'src/client.ts',
    output: [
      {
        file: 'dist/client.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
      {
        file: 'dist/client.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
    ],
    plugins,
    external,
  },
]; 
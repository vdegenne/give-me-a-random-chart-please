import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/give-me-a-random-chart-please.ts',
  output: { file: './bundle.js', format: 'esm' },
  plugins: [typescript(), nodeResolve()]
}
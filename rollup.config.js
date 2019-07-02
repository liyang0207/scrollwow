import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.NODE_ENV === 'production';
const outputFile = isProduction ? 'build/scrollwow.min.js' : 'dev/scrollwow.js';

export default {
  input: 'src/index.js',
  output: {
    file: outputFile,
    format: 'umd',
    name: 'scrollwow'
  },
  plugins: [
    isProduction && terser(),
    filesize()
  ].filter(Boolean)
}

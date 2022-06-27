import { defineConfig } from 'vite'
import postcssNesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssNesting, autoprefixer],
    },
  },
})

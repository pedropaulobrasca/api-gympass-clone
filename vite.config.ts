const tsconfigPaths = require('vite-tsconfig-paths')
const { defineConfig } =  require('vitest/config')

export default defineConfig({
  plugins: [tsconfigPaths()],
})

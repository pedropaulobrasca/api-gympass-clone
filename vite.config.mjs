/// <reference types="vitest" />
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      // Aplica o ambiente personalizado aos testes em src/http/controllers/**
      ['src/http/controllers/**', './vitest-environment-custom/index.ts'],
    ],
    dir: 'src',
  },
})

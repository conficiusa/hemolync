import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['eslint.config.js', 'prettier.config.js', 'vite.config.js'],
  },
  ...tanstackConfig,
].map((config) => {
  if (config.rules) {
    config.rules['no-shadow'] = 'off'
  }
  return config
})

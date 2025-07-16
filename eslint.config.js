//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [...tanstackConfig].map((config) => {
  if (config.rules) {
    config.rules['no-shadow'] = 'off'
  }
  return config
})

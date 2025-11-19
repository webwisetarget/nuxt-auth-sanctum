import type { NuxtModule } from '@nuxt/schema'

import type { default as Module, ModulePublicRuntimeConfig } from './module.mjs'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
}

export type ModuleOptions = typeof Module extends NuxtModule<infer O> ? Partial<O> : Record<string, any>

export { default } from './module.mjs'

export { type ModulePublicRuntimeConfig } from './module.mjs'

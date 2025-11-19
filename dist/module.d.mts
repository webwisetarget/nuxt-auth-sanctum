import * as _nuxt_schema from '@nuxt/schema';
import { ModuleOptions } from '../dist/runtime/types/options.js';

type ModulePublicRuntimeConfig = {
    sanctum: ModuleOptions;
};
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModulePublicRuntimeConfig };

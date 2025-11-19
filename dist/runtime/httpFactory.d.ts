import type { $Fetch } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { type NuxtApp } from '#app';
/**
 * Creates a custom OFetch instance with interceptors and Laravel-specific options.
 * @param nuxtApp Nuxt application instance
 * @param logger Module logger instance
 */
export declare function createHttpClient(nuxtApp: NuxtApp, logger: ConsolaInstance): $Fetch;

import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { type NuxtApp } from '#app';
/**
 * Validate response headers and log warnings if any are missing or invalid.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function validateResponseHeaders(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import type { NuxtApp } from '#app';
/**
 * Modify request before sending it to the Laravel API
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function setRequestParams(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

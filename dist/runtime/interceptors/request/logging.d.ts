import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import type { NuxtApp } from '#app';
/**
 * Logs information about the request before it is sent to the API.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function logRequestHeaders(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

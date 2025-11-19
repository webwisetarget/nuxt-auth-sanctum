import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { type NuxtApp } from '#app';
/**
 * Pass all cookies from the API to the client on SSR response
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function proxyResponseHeaders(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

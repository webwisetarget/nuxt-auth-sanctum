import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import type { NuxtApp } from '#app';
/**
 * Sets the authentication Bearer token in the request header
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function setTokenHeader(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { type NuxtApp } from '#app';
/**
 * Handle cookies and headers for the request
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export declare function setStatefulParams(app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance): Promise<void>;

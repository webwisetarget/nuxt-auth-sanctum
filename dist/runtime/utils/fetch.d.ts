import type { FetchOptions } from 'ofetch';
/**
 * Assemble a unique key for the fetch request, required for hydration.
 * @param url The URL to fetch
 * @param lazy Whether the request is lazy or not
 * @param options Optional fetch options
 */
export declare function assembleFetchRequestKey(url: string, lazy: boolean, options?: FetchOptions): string;

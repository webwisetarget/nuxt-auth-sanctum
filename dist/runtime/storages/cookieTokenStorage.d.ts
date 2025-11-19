import type { TokenStorage } from '../types/config.js';
/**
 * Token storage using a secure cookie for HTTPS and plain cookie for HTTP.
 * Works with both CSR/SSR modes.
 */
export declare const cookieTokenStorage: TokenStorage;

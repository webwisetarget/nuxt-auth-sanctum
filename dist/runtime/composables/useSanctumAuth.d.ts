import { type Ref } from 'vue';
export interface SanctumAuth<T> {
    user: Ref<T | null>;
    isAuthenticated: Ref<boolean>;
    init: () => Promise<void>;
    login: (credentials: Record<string, unknown>) => Promise<unknown>;
    logout: () => Promise<void>;
    refreshIdentity: () => Promise<void>;
}
export type TokenResponse = {
    token?: string;
};
/**
 * Provides authentication methods for Laravel Sanctum
 *
 * @template T Type of the user object
 */
export declare const useSanctumAuth: <T>() => SanctumAuth<T>;

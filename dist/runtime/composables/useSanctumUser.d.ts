import type { Ref } from 'vue';
/**
 * Returns a current authenticated user information.
 * @returns Reference to the user state as T.
 */
export declare const useSanctumUser: <T>() => Ref<T | null>;

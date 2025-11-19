import type { FetchOptions } from 'ofetch';
import type { DefaultAsyncDataErrorValue, DefaultAsyncDataValue } from 'nuxt/app/defaults';
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData';
import type { NuxtError } from '#app';
export declare function useLazySanctumFetch<ResT, NuxtErrorDataT = unknown, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = DefaultAsyncDataValue>(url: string, options?: FetchOptions, asyncDataOptions?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, (NuxtErrorDataT extends Error | NuxtError ? NuxtErrorDataT : NuxtError<NuxtErrorDataT>) | DefaultAsyncDataErrorValue>;

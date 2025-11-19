import { assembleFetchRequestKey } from "../utils/fetch.js";
import { useLazyAsyncData, useSanctumClient } from "#imports";
export function useLazySanctumFetch(url, options, asyncDataOptions) {
  const client = useSanctumClient();
  const key = assembleFetchRequestKey(url, true, options);
  return useLazyAsyncData(
    key,
    () => client(url, options),
    asyncDataOptions
  );
}

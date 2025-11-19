import { assembleFetchRequestKey } from "../utils/fetch.js";
import { useAsyncData, useSanctumClient } from "#imports";
export function useSanctumFetch(url, options, asyncDataOptions) {
  const client = useSanctumClient();
  const key = assembleFetchRequestKey(url, false, options);
  return useAsyncData(
    key,
    () => client(url, options),
    asyncDataOptions
  );
}

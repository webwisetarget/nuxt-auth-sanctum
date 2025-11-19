import { useRuntimeConfig } from "#app";
export const useSanctumConfig = () => {
  return useRuntimeConfig().public.sanctum;
};

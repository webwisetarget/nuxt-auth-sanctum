import { useAppConfig } from "#app";
export const useSanctumAppConfig = () => {
  return useAppConfig().sanctum ?? {};
};

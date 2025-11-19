import { useSanctumConfig } from "./useSanctumConfig.js";
import { useState } from "#app";
export const useSanctumUser = () => {
  const options = useSanctumConfig();
  return useState(options.userStateKey, () => null);
};

import { useSanctumAuth } from "../composables/useSanctumAuth.js";
import { useSanctumConfig } from "../composables/useSanctumConfig.js";
import { defineNuxtRouteMiddleware, navigateTo, createError } from "#app";
export default defineNuxtRouteMiddleware(() => {
  const options = useSanctumConfig();
  const { isAuthenticated } = useSanctumAuth();
  if (!isAuthenticated.value) {
    return;
  }
  const endpoint = options.redirect.onGuestOnly;
  if (endpoint === void 0) {
    throw new Error("`sanctum.redirect.onGuestOnly` is not defined");
  }
  if (endpoint === false) {
    throw createError({ statusCode: 403 });
  }
  return navigateTo(endpoint, { replace: true });
});

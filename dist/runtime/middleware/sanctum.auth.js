import { useSanctumConfig } from "../composables/useSanctumConfig.js";
import { useSanctumAuth } from "../composables/useSanctumAuth.js";
import { trimTrailingSlash } from "../utils/formatter.js";
import { defineNuxtRouteMiddleware, navigateTo, createError } from "#app";
export default defineNuxtRouteMiddleware((to) => {
  const options = useSanctumConfig();
  const { isAuthenticated } = useSanctumAuth();
  if (isAuthenticated.value) {
    return;
  }
  const endpoint = options.redirect.onAuthOnly;
  if (endpoint === void 0) {
    throw new Error("`sanctum.redirect.onAuthOnly` is not defined");
  }
  if (endpoint === false) {
    throw createError({ statusCode: 403 });
  }
  const redirect = { path: endpoint };
  if (options.redirect.keepRequestedRoute) {
    redirect.query = { redirect: trimTrailingSlash(to.fullPath) };
  }
  return navigateTo(redirect, { replace: true });
});

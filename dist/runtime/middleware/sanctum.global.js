import { useSanctumConfig } from "../composables/useSanctumConfig.js";
import { useSanctumAuth } from "../composables/useSanctumAuth.js";
import { trimTrailingSlash } from "../utils/formatter.js";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";
export default defineNuxtRouteMiddleware((to) => {
  const options = useSanctumConfig();
  const { isAuthenticated } = useSanctumAuth();
  const [homePage, loginPage] = [
    options.redirect.onGuestOnly,
    options.redirect.onAuthOnly
  ];
  if (homePage === void 0 || homePage === false) {
    throw new Error(
      "You must define onGuestOnly route when using global middleware."
    );
  }
  if (loginPage === void 0 || loginPage === false) {
    throw new Error(
      "You must define onAuthOnly route when using global middleware."
    );
  }
  if (options.globalMiddleware.allow404WithoutAuth && to.matched.length === 0) {
    return;
  }
  if (to.meta.sanctum?.excluded === true) {
    return;
  }
  const isPageForGuestsOnly = trimTrailingSlash(to.path) === loginPage || to.meta.sanctum?.guestOnly === true;
  if (isAuthenticated.value) {
    if (isPageForGuestsOnly) {
      return navigateTo(homePage, { replace: true });
    }
    return;
  }
  if (isPageForGuestsOnly) {
    return;
  }
  const redirect = { path: loginPage };
  if (options.redirect.keepRequestedRoute) {
    redirect.query = { redirect: trimTrailingSlash(to.fullPath) };
  }
  return navigateTo(redirect, { replace: true });
});

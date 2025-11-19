import { computed } from "vue";
import { trimTrailingSlash } from "../utils/formatter.js";
import { IDENTITY_LOADED_KEY } from "../utils/constants.js";
import { useSanctumClient } from "./useSanctumClient.js";
import { useSanctumUser } from "./useSanctumUser.js";
import { useSanctumConfig } from "./useSanctumConfig.js";
import { useSanctumAppConfig } from "./useSanctumAppConfig.js";
import { navigateTo, useNuxtApp, useRoute, useState } from "#app";
export const useSanctumAuth = () => {
  const nuxtApp = useNuxtApp();
  const user = useSanctumUser();
  const client = useSanctumClient();
  const options = useSanctumConfig();
  const appConfig = useSanctumAppConfig();
  const isAuthenticated = computed(() => {
    return user.value !== null;
  });
  const isIdentityLoaded = useState(
    IDENTITY_LOADED_KEY,
    () => false
  );
  async function init() {
    if (isIdentityLoaded.value) {
      return;
    }
    isIdentityLoaded.value = true;
    await refreshIdentity();
    await nuxtApp.callHook("sanctum:init");
  }
  async function refreshIdentity() {
    user.value = await client(options.endpoints.user);
    await nuxtApp.callHook("sanctum:refresh");
  }
  async function login(credentials) {
    const currentRoute = useRoute();
    const currentPath = trimTrailingSlash(currentRoute.path);
    if (isAuthenticated.value) {
      if (!options.redirectIfAuthenticated) {
        throw new Error("User is already authenticated");
      }
      if (options.redirect.onLogin === false || options.redirect.onLogin === currentPath) {
        return;
      }
      if (options.redirect.onLogin === void 0) {
        throw new Error("`sanctum.redirect.onLogin` is not defined");
      }
      const redirectUrl2 = options.redirect.onLogin;
      await nuxtApp.callHook("sanctum:redirect", redirectUrl2);
      await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl2));
    }
    if (options.endpoints.login === void 0) {
      throw new Error("`sanctum.endpoints.login` is not defined");
    }
    const response = await client(options.endpoints.login, {
      method: "post",
      body: credentials
    });
    if (options.mode === "token") {
      if (appConfig.tokenStorage === void 0) {
        throw new Error("`sanctum.tokenStorage` is not defined in app.config.ts");
      }
      if (response.token === void 0) {
        throw new Error("Token was not returned from the API");
      }
      await appConfig.tokenStorage.set(nuxtApp, response.token);
    }
    await refreshIdentity();
    await nuxtApp.callHook("sanctum:login");
    if (options.redirect.keepRequestedRoute) {
      const requestedRoute = currentRoute.query.redirect;
      if (requestedRoute && requestedRoute !== currentPath) {
        await nuxtApp.callHook("sanctum:redirect", requestedRoute);
        await nuxtApp.runWithContext(async () => await navigateTo(requestedRoute));
        return response;
      }
    }
    if (options.redirect.onLogin === false || currentRoute.path === options.redirect.onLogin) {
      return response;
    }
    if (options.redirect.onLogin === void 0) {
      throw new Error("`sanctum.redirect.onLogin` is not defined");
    }
    const redirectUrl = options.redirect.onLogin;
    await nuxtApp.callHook("sanctum:redirect", redirectUrl);
    await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl));
    return response;
  }
  async function logout() {
    if (!isAuthenticated.value) {
      throw new Error("User is not authenticated");
    }
    const currentRoute = useRoute();
    const currentPath = trimTrailingSlash(currentRoute.path);
    if (options.endpoints.logout === void 0) {
      throw new Error("`sanctum.endpoints.logout` is not defined");
    }
    await client(options.endpoints.logout, { method: "post" });
    user.value = null;
    await nuxtApp.callHook("sanctum:logout");
    if (options.mode === "token") {
      if (appConfig.tokenStorage === void 0) {
        throw new Error("`sanctum.tokenStorage` is not defined in app.config.ts");
      }
      await appConfig.tokenStorage.set(nuxtApp, void 0);
    }
    if (options.redirect.onLogout === false || currentPath === options.redirect.onLogout) {
      return;
    }
    if (options.redirect.onLogout === void 0) {
      throw new Error("`sanctum.redirect.onLogout` is not defined");
    }
    const redirectUrl = options.redirect.onLogout;
    await nuxtApp.callHook("sanctum:redirect", redirectUrl);
    await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl));
  }
  return {
    user,
    isAuthenticated,
    init,
    login,
    logout,
    refreshIdentity
  };
};

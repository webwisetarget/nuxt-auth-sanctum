import { createConsola } from "consola";
import { createHttpClient } from "./httpFactory.js";
import { useSanctumUser } from "./composables/useSanctumUser.js";
import { useSanctumConfig } from "./composables/useSanctumConfig.js";
import { useSanctumAppConfig } from "./composables/useSanctumAppConfig.js";
import { IDENTITY_LOADED_KEY } from "./utils/constants.js";
import { defineNuxtPlugin, updateAppConfig, useState } from "#app";
const LOGGER_NAME = "nuxt-auth-sanctum";
function createSanctumLogger(logLevel) {
  const envSuffix = import.meta.server ? "ssr" : "csr";
  const loggerName = LOGGER_NAME + ":" + envSuffix;
  return createConsola({ level: logLevel }).withTag(loggerName);
}
async function setupDefaultTokenStorage(nuxtApp, logger) {
  logger.debug(
    "Token storage is not defined, switch to default cookie storage"
  );
  const defaultStorage = await import("./storages/cookieTokenStorage.js");
  nuxtApp.runWithContext(() => {
    updateAppConfig({
      sanctum: {
        tokenStorage: defaultStorage.cookieTokenStorage
      }
    });
  });
}
async function initialIdentityLoad(nuxtApp, client, options, logger) {
  const user = useSanctumUser();
  const identityFetchedOnInit = useState(
    IDENTITY_LOADED_KEY,
    () => false
  );
  if (user.value === null && !identityFetchedOnInit.value) {
    identityFetchedOnInit.value = true;
    logger.debug("Fetching user identity on plugin initialization");
    if (!options.endpoints.user) {
      throw new Error("`sanctum.endpoints.user` is not defined");
    }
    const response = await client.raw(
      options.endpoints.user,
      { ignoreResponseError: true }
    );
    if (response.ok) {
      user.value = response._data;
      return await nuxtApp.callHook("sanctum:init");
    }
    handleIdentityLoadError(response, logger);
  }
}
function handleIdentityLoadError(response, logger) {
  if ([401, 419].includes(response.status)) {
    logger.debug(
      "User is not authenticated on plugin initialization, status:",
      response.status
    );
  } else {
    logger.error("Unable to load user identity from API", response.status);
  }
}
export default defineNuxtPlugin({
  name: "nuxt-auth-sanctum",
  async setup(_nuxtApp) {
    const nuxtApp = _nuxtApp;
    const options = useSanctumConfig();
    const appConfig = useSanctumAppConfig();
    const logger = createSanctumLogger(options.logLevel);
    const client = createHttpClient(nuxtApp, logger);
    if (options.mode === "token" && !appConfig.tokenStorage) {
      await setupDefaultTokenStorage(nuxtApp, logger);
    }
    if (options.client.initialRequest) {
      await initialIdentityLoad(nuxtApp, client, options, logger);
    }
    return {
      provide: {
        sanctumClient: client
      }
    };
  }
});

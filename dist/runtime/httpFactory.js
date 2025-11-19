import { useSanctumUser } from "./composables/useSanctumUser.js";
import { useSanctumConfig } from "./composables/useSanctumConfig.js";
import { useSanctumAppConfig } from "./composables/useSanctumAppConfig.js";
import { interceptors } from "./interceptors/index.js";
import { navigateTo } from "#app";
function useClientInterceptors(appConfig) {
  const [request, response] = [
    [...interceptors.request],
    [...interceptors.response]
  ];
  if (appConfig.interceptors?.onRequest) {
    request.push(appConfig.interceptors.onRequest);
  }
  if (appConfig.interceptors?.onResponse) {
    response.push(appConfig.interceptors.onResponse);
  }
  return [request, response];
}
function determineCredentialsMode() {
  const isCredentialsSupported = "credentials" in Request.prototype;
  if (!isCredentialsSupported) {
    return void 0;
  }
  return "include";
}
export function createHttpClient(nuxtApp, logger) {
  const options = useSanctumConfig();
  const user = useSanctumUser();
  const appConfig = useSanctumAppConfig();
  const [
    requestInterceptors,
    responseInterceptors
  ] = useClientInterceptors(appConfig);
  const httpOptions = {
    baseURL: options.baseUrl,
    credentials: determineCredentialsMode(),
    redirect: "manual",
    retry: options.client.retry === true ? 1 : options.client.retry,
    // false or number
    async onRequest(context) {
      for (const interceptor of requestInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger);
        });
      }
    },
    async onResponse(context) {
      for (const interceptor of responseInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger);
        });
      }
    },
    async onRequestError(context) {
      await nuxtApp.callHook("sanctum:error:request", context);
    },
    async onResponseError({ response }) {
      await nuxtApp.callHook("sanctum:error", response);
      if (response.status === 419) {
        logger.warn("CSRF token mismatch, check your API configuration");
        return;
      }
      if (response.status === 401) {
        if (user.value !== null) {
          logger.warn("User session is not set in API or expired, resetting identity");
          user.value = null;
        }
        if (import.meta.client && options.redirectIfUnauthenticated && options.redirect.onAuthOnly) {
          const redirectUrl = options.redirect.onAuthOnly;
          await nuxtApp.callHook("sanctum:redirect", redirectUrl);
          await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl));
        }
      }
    }
  };
  return $fetch.create(httpOptions);
}

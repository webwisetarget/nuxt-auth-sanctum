import { useSanctumConfig } from "../../composables/useSanctumConfig.js";
import { useCookie, useRequestHeaders, useRequestURL } from "#app";
const SECURE_METHODS = /* @__PURE__ */ new Set(["post", "delete", "put", "patch"]);
const COOKIE_OPTIONS = { readonly: true };
function useClientHeaders(headers, config, logger) {
  const clientHeaders = useRequestHeaders(["cookie", "user-agent"]);
  const origin = config.origin ?? useRequestURL().origin;
  const headersToAdd = {
    Referer: origin,
    Origin: origin,
    ...clientHeaders.cookie && { Cookie: clientHeaders.cookie },
    ...clientHeaders["user-agent"] && { "User-Agent": clientHeaders["user-agent"] }
  };
  for (const [key, value] of Object.entries(headersToAdd)) {
    headers.set(key, value);
  }
  logger.debug(
    "[request] added client headers to server request",
    Object.keys(headersToAdd)
  );
}
async function initCsrfCookie(config, logger) {
  if (config.endpoints.csrf === void 0) {
    throw new Error("`sanctum.endpoints.csrf` is not defined");
  }
  await $fetch(config.endpoints.csrf, {
    baseURL: config.baseUrl,
    credentials: "include"
  });
  logger.debug("[request] CSRF cookie has been initialized");
}
async function useCsrfHeader(headers, config, logger) {
  if (config.csrf.cookie === void 0) {
    throw new Error("`sanctum.csrf.cookie` is not defined");
  }
  if (config.csrf.header === void 0) {
    throw new Error("`sanctum.csrf.header` is not defined");
  }
  let csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS);
  if (!csrfToken.value) {
    await initCsrfCookie(config, logger);
    csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS);
  }
  if (!csrfToken.value) {
    logger.warn(`${config.csrf.cookie} cookie is missing, unable to set ${config.csrf.header} header`);
    return;
  }
  headers.set(config.csrf.header, csrfToken.value);
  logger.debug(`[request] added ${config.csrf.header} header`);
}
export async function setStatefulParams(app, ctx, logger) {
  const config = useSanctumConfig();
  if (config.mode !== "cookie") {
    return;
  }
  const method = ctx.options.method?.toLowerCase() ?? "get";
  if (import.meta.server) {
    useClientHeaders(
      ctx.options.headers,
      config,
      logger
    );
  }
  if (SECURE_METHODS.has(method)) {
    await useCsrfHeader(
      ctx.options.headers,
      config,
      logger
    );
  }
}

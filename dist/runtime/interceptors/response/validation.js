import { useRequestURL } from "#app";
const validateCookieHeader = (headers, config, logger) => {
  if (config.mode == "token") {
    return;
  }
  if (!headers.has("set-cookie")) {
    logger.warn("[response] `set-cookie` header is missing, CSRF token will not be set");
  }
};
const validateContentTypeHeader = (headers, config, logger) => {
  const contentType = headers.get("content-type");
  if (!contentType) {
    logger.warn('[response] "content-type" header is missing');
    return;
  }
  if (!contentType.includes("application/json")) {
    logger.debug(`[response] 'content-type' is present in response but different (expected: application/json, got: ${contentType})`);
  }
};
const validateCredentialsHeader = (headers, config, logger) => {
  if (config.mode == "token") {
    return;
  }
  const allowCredentials = headers.get("access-control-allow-credentials");
  if (!allowCredentials || allowCredentials !== "true") {
    logger.warn(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: ${allowCredentials})`);
  }
};
const validateOriginHeader = (headers, config, logger) => {
  const allowOrigin = headers.get("access-control-allow-origin");
  const currentOrigin = config?.origin ?? useRequestURL().origin;
  if (!allowOrigin || !allowOrigin.includes(currentOrigin)) {
    logger.warn(`[response] 'access-control-allow-origin' header is missing or invalid (expected: ${currentOrigin}, got: ${allowOrigin})`);
  }
};
const validators = [
  validateCookieHeader,
  validateContentTypeHeader,
  validateCredentialsHeader,
  validateOriginHeader
];
export async function validateResponseHeaders(app, ctx, logger) {
  if (import.meta.client) {
    logger.debug("[response] skipping headers validation on CSR");
    return;
  }
  const config = app.$config.public.sanctum;
  const headers = ctx.response?.headers;
  if (!headers) {
    logger.warn("[response] no headers returned from API");
    return;
  }
  for (const validator of validators) {
    validator(headers, config, logger);
  }
}

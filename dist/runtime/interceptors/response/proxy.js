import { getResponseHeaders, setResponseHeaders, splitCookiesString } from "h3";
import { useSanctumConfig } from "../../composables/useSanctumConfig.js";
import { navigateTo, useRequestEvent } from "#app";
const ServerCookieName = "set-cookie";
function appendServerResponseHeaders(app, ctx, logger) {
  const event = useRequestEvent(app);
  if (event === void 0) {
    logger.debug(`[response] no event to pass cookies to the client [${ctx.request}]`);
    return;
  }
  const eventHeaders = getResponseHeaders(event);
  const cookiesFromEvent = extractCookiesFromEventHeaders(eventHeaders);
  const cookiesFromResponse = extractCookiesFromResponse(ctx, logger);
  const cookiesMap = createCookiesMap(cookiesFromEvent, cookiesFromResponse);
  writeCookiesToEventResponse(event, eventHeaders, cookiesMap);
  logger.debug(
    `[response] pass cookies from server to client response`,
    Array.from(cookiesMap.keys())
  );
}
function extractCookiesFromEventHeaders(headers) {
  const cookieHeader = headers[ServerCookieName] ?? [];
  if (Array.isArray(cookieHeader)) {
    return cookieHeader;
  }
  return [cookieHeader];
}
function extractCookiesFromResponse(ctx, logger) {
  const cookieHeader = ctx.response.headers.get(ServerCookieName);
  if (cookieHeader === null) {
    logger.debug(`[response] no cookies to pass to the client [${ctx.request}]`);
    return [];
  }
  return splitCookiesString(cookieHeader);
}
function createCookiesMap(...cookieCollections) {
  const cookiesMap = /* @__PURE__ */ new Map();
  for (const cookies of cookieCollections) {
    for (const cookie of cookies) {
      const cookieName = cookie.split("=")[0];
      if (cookieName === void 0) {
        continue;
      }
      cookiesMap.set(cookieName, cookie);
    }
  }
  return cookiesMap;
}
function writeCookiesToEventResponse(event, headers, cookiesMap) {
  const mergedHeaders = {
    ...headers,
    [ServerCookieName]: Array.from(cookiesMap.values())
  };
  setResponseHeaders(event, mergedHeaders);
}
export async function proxyResponseHeaders(app, ctx, logger) {
  const config = useSanctumConfig();
  if (config.mode !== "cookie") {
    return;
  }
  if (ctx.response === void 0) {
    logger.debug("[response] no response to process");
    return;
  }
  if (import.meta.server) {
    appendServerResponseHeaders(app, ctx, logger);
  }
  if (ctx.response.redirected) {
    const redirectUrl = ctx.response.url;
    await app.callHook("sanctum:redirect", redirectUrl);
    await app.runWithContext(async () => await navigateTo(redirectUrl));
  }
}

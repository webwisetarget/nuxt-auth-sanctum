const ACCEPT_HEADER = "Accept";
export async function setRequestParams(app, ctx, logger) {
  const method = ctx.options.method?.toLowerCase() ?? "get";
  if (!ctx.options.headers?.has(ACCEPT_HEADER)) {
    ctx.options.headers.set(ACCEPT_HEADER, "application/json");
    logger.debug(`[request] added default ${ACCEPT_HEADER} header`);
  }
  if (method === "put" && ctx.options.body instanceof FormData) {
    ctx.options.method = "POST";
    ctx.options.body.append("_method", "PUT");
    logger.debug("[request] changed PUT to POST method for FormData compatibility");
  }
}

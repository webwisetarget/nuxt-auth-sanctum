export async function logResponseHeaders(app, ctx, logger) {
  logger.trace(
    `Response headers for "${ctx.request.toString()}"`,
    ctx.response ? Object.fromEntries(ctx.response.headers.entries()) : {}
  );
}

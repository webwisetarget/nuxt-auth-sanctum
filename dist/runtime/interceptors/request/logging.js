export async function logRequestHeaders(app, ctx, logger) {
  logger.trace(
    `Request headers for "${ctx.request.toString()}"`,
    ctx.options.headers instanceof Headers ? Object.fromEntries(ctx.options.headers.entries()) : ctx.options.headers
  );
}

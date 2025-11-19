import { useSanctumAppConfig } from "../../composables/useSanctumAppConfig.js";
import { useSanctumConfig } from "../../composables/useSanctumConfig.js";
const AUTHORIZATION_HEADER = "Authorization";
export async function setTokenHeader(app, ctx, logger) {
  const config = useSanctumConfig();
  if (config.mode !== "token") {
    return;
  }
  const appConfig = useSanctumAppConfig();
  if (appConfig.tokenStorage === void 0) {
    throw new Error("`sanctum.tokenStorage` is not defined in app.config.ts");
  }
  const token = await appConfig.tokenStorage.get(app);
  if (!token) {
    logger.debug("[request] authentication token is not set in the storage");
    return;
  }
  const bearerToken = `Bearer ${token}`;
  ctx.options.headers.set(AUTHORIZATION_HEADER, bearerToken);
  logger.debug(`[request] added ${AUTHORIZATION_HEADER} token header`);
}

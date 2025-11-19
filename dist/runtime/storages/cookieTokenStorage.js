import { unref } from "vue";
import { useCookie, useRequestURL } from "#app";
const cookieTokenKey = "sanctum.token.cookie";
export const cookieTokenStorage = {
  async get(app) {
    return app.runWithContext(() => {
      const cookie = useCookie(cookieTokenKey, { readonly: true });
      return unref(cookie.value) ?? void 0;
    });
  },
  async set(app, token) {
    await app.runWithContext(() => {
      const isSecure = useRequestURL().protocol.startsWith("https");
      const cookie = useCookie(cookieTokenKey, { secure: isSecure });
      cookie.value = token;
    });
  }
};

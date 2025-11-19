import { setRequestParams } from "./request/params.js";
import { setStatefulParams } from "./request/stateful.js";
import { setTokenHeader } from "./request/token.js";
import { logRequestHeaders } from "./request/logging.js";
import { proxyResponseHeaders } from "./response/proxy.js";
import { validateResponseHeaders } from "./response/validation.js";
import { logResponseHeaders } from "./response/logging.js";
const [request, response] = [
  [
    setRequestParams,
    setStatefulParams,
    setTokenHeader,
    logRequestHeaders
  ],
  [
    proxyResponseHeaders,
    validateResponseHeaders,
    logResponseHeaders
  ]
];
export const interceptors = {
  request,
  response
};

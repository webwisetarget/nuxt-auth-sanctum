function serializeBody(body) {
  if (!body) return {};
  if (body instanceof FormData) {
    const obj = {};

    for (const [key, value] of body.entries()) {
      if (value instanceof File || value instanceof Blob) {
        obj[key] = {
          type: "file",
          name: value.name,
          size: value.size,
          mime: value.type
        };
      } else {
        obj[key] = value;
      }
    }

    return obj;
  }
  return body;
}

export function assembleFetchRequestKey(url, lazy, options) {
  const operation = lazy ? "lazy-fetch" : "fetch";

  const serializedBody = serializeBody(options?.body);
  const serializedQuery = options?.query ?? {};

  const parts = [
    "sanctum",
    operation,
    url,
    options?.method ?? "get",
    JSON.stringify({
      query: serializedQuery,
      body: serializedBody
    })
  ];

  return parts.join(":");
}

const STOREFRONT_API_BASE_URL =
  import.meta.env.VITE_STOREFRONT_API_BASE_URL ?? "https://localhost:7100";

export interface StorefrontApiError {
  status: number;
  message: string;
  details?: unknown;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

function normalizeError(status: number, payload: unknown): StorefrontApiError {
  if (payload && typeof payload === "object") {
    const maybePayload = payload as Record<string, unknown>;
    const message =
      typeof maybePayload.message === "string"
        ? maybePayload.message
        : typeof maybePayload.error === "string"
        ? maybePayload.error
        : typeof maybePayload.title === "string"
        ? maybePayload.title
        : "Mohon maaf, terjadi kendala saat memproses data Anda. Silakan coba beberapa saat lagi.";

    return {
      status,
      message,
      details: maybePayload,
    };
  }

  return {
    status,
    message: "Koneksi terputus. Silakan periksa jaringan Anda.",
    details: payload,
  };
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (contentType.includes("text/")) {
    return response.text();
  }
  return null;
}

function buildUrl(path: string, params?: Record<string, string>) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${STOREFRONT_API_BASE_URL}${cleanPath}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
}

async function executeRequest<T>(
  path: string,
  method: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { headers, params } = options;
  const mergedHeaders = new Headers(headers ?? {});

  if (body !== undefined && !mergedHeaders.has("Content-Type")) {
    mergedHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      headers: mergedHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw normalizeError(response.status, payload);
    }

    return payload as T;
  } catch (error) {
    if ((error as StorefrontApiError).status !== undefined) {
      throw error;
    }
    throw {
      status: 0,
      message: "Gagal terhubung ke server. Silakan periksa koneksi internet Anda.",
      details: error,
    } as StorefrontApiError;
  }
}

export const storefrontClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    executeRequest<T>(path, "GET", undefined, options),
    
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    executeRequest<T>(path, "POST", body, options),
};

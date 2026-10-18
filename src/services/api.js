const CONFIGURED_API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// Local requests go through Vite's /api proxy to the local Express server.
// This avoids accidentally sending local registrations to a deployed API.
const BASE_URL = import.meta.env.DEV ? "" : CONFIGURED_API_URL;

export class ApiError extends Error {
  constructor(message, { status = 0, data = null, network = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.network = network;
  }
}

export function getApiBaseUrl() {
  return BASE_URL;
}

export async function request(path, { method = "GET", body, signal } = {}) {
  const url = `${BASE_URL}${path}`;
  let response;

  try {
    response = await fetch(url, {
      method,
      signal,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError(
      "Could not reach the local server. Make sure the backend is running and try again.",
      { network: true },
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      `The API rejected the request (HTTP ${response.status}). Check the backend terminal for details.`;
    throw new ApiError(message, { status: response.status, data });
  }

  if (data === null) {
    throw new ApiError("The server returned an invalid response.", {
      status: response.status,
    });
  }

  return data;
}

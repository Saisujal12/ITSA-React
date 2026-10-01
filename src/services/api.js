const BASE_URL = (
  import.meta.env.VITE_API_URL ?? ""
).replace(/\/$/, "");

/*
 * Shown when the response has no usable JSON `message` (e.g. an HTML error
 * page from a proxy or host), so users never see raw server output.
 */
const STATUS_MESSAGES = {
  400: "Some details were not accepted. Please check them and try again.",
  401: "You are not signed in, or your session has expired.",
  403: "You do not have permission to do that.",
  404: "The service could not be found. Please try again later.",
  409: "This conflicts with an existing record.",
  413: "The request is too large.",
  429: "Too many requests. Please wait a few minutes and try again.",
};

const SERVER_ERROR_MESSAGE =
  "The server is having trouble right now. Please try again in a few minutes.";

const fallbackMessage = (status) =>
  STATUS_MESSAGES[status] ??
  (status >= 500
    ? SERVER_ERROR_MESSAGE
    : `Request failed (${status}).`);

export class ApiError extends Error {
  constructor(
    message,
    {
      status = 0,
      data = null,
      network = false,
    } = {},
  ) {
    super(message);

    this.name = "ApiError";

    this.status = status;

    this.data = data;

    this.network = network;
  }
}

/*
|--------------------------------------------------------------------------
| API URL
|--------------------------------------------------------------------------
|
| Production:
|
| If VITE_API_URL is empty:
|
|   /api/...
|
| This is important for Vercel because the
| frontend and API are deployed together.
|
| Local development:
|
|   VITE_API_URL=http://localhost:5000
|
|--------------------------------------------------------------------------
*/

export function getApiBaseUrl() {
  return BASE_URL;
}

export async function request(
  path,
  {
    method = "GET",
    body,
    signal,
  } = {},
) {
  const url =
    `${BASE_URL}${path}`;

  let response;

  try {
    response =
      await fetch(url, {
        method,

        signal,

        /*
         * Required for admin authentication
         * because the admin session uses a cookie.
         */
        credentials: "include",

        headers:
          body === undefined
            ? undefined
            : {
                "Content-Type":
                  "application/json",
              },

        body:
          body === undefined
            ? undefined
            : JSON.stringify(
                body,
              ),
      });
  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      throw error;
    }

    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
      {
        network: true,
      },
    );
  }

  const text =
    await response.text();

  let data = null;

  if (text) {
    try {
      data =
        JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      typeof data?.message ===
        "string" && data.message
        ? data.message
        : fallbackMessage(
            response.status,
          ),
      {
        status:
          response.status,

        data,
      },
    );
  }

  if (data === null) {
    throw new ApiError(
      "The server returned an invalid response.",
      {
        status:
          response.status,
      },
    );
  }

  return data;
}
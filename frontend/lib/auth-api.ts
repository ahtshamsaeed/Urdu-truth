export type AuthenticatedUser = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_URDUTRUTH_API_URL ?? "http://localhost:8000/api/v1";

export async function authRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new AuthApiError(
        "Cannot reach the UrduTruth API. Check that the backend is running.",
        0,
      );
    }
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AuthApiError("The UrduTruth API returned an invalid response.", response.status);
    }
    throw error;
  }

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? payload.detail
        : undefined;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) &&
            detail.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                "msg" in item &&
                typeof item.msg === "string",
            )
          ? detail.map((item) => item.msg).filter(Boolean).join(". ")
          : `The request failed with status ${response.status}.`;
    throw new AuthApiError(message, response.status);
  }

  return payload as T;
}

// src/lib/fetchWithAuth.ts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const options: RequestInit = {
    ...init,
    credentials: "include", // Automatically sends HTTP-only cookies
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  };

  let response = await fetch(input, options);

  // Success - return response
  if (response.status !== 401) {
    return response;
  }

  // 401 Error - need to refresh token

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise<Response>((resolve, reject) => {
      failedQueue.push({
        resolve: () => fetch(input, options).then(resolve),
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    // Call refresh token endpoint
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/refreshToken`,
      {
        method: "POST",
        credentials: "include", // Sends old cookie, receives new one
        headers: { "Content-Type": "application/json" },
      },
    );

    // Refresh failed - redirect to login
    if (!refreshResponse.ok) {
      processQueue(new Error("Token refresh failed"));
      window.location.href = "/public/login";
      return refreshResponse;
    }

    // Refresh success - process queued requests and retry original
    processQueue(null);
    response = await fetch(input, options);
    return response;
  } catch (error) {
    // Network error during refresh
    processQueue(error);
    window.location.href = "/public/login";
    throw error;
  } finally {
    isRefreshing = false;
  }
}

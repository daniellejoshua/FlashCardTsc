export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
) {
  const options: RequestInit = {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  };

  let response = await fetch(input, options);

  if (response.status !== 401) {
    return response;
  }

  const refresh = await fetch("/api/user/refreshToken", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!refresh.ok) {
    return response;
  }

  response = await fetch(input, options);
  return response;
}

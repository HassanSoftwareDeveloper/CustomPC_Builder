import { STORAGE_KEYS } from "../constants/storageKeys";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let refreshing = null;

export function refreshAccessToken() {
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "Session expired");
        if (!data?.token || !data?.user) {
          throw new Error("Invalid refresh response");
        }
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.user));
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function request(path, options = {}, canRetry = true) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && token && canRetry && !path.startsWith("/auth/")) {
    try {
      await refreshAccessToken();
      return request(path, options, false);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.dispatchEvent(new Event("apna:session-expired"));
    }
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

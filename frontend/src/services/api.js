import { STORAGE_KEYS } from "../constants/storageKeys";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function request(path, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}
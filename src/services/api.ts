import axios from "axios";
import { BASE_URL } from "./endpoints";
export const AUTH_EXPIRED = "benchcoder:auth-expired";
export function tokenExpiry(token: string): number {
  try {
    return (
      JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      ).exp * 1000 || 0
    );
  } catch {
    return 0;
  }
}
export function clearSession() {
  localStorage.removeItem("authToken");
  window.dispatchEvent(new Event(AUTH_EXPIRED));
}
const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });
api.interceptors.request.use((config) => {
  if (config.url === "/auth/login/" || config.url === "/auth/register/") {
    config.headers.delete("Authorization");
    return config;
  }
  const token = localStorage.getItem("authToken");
  if (token && tokenExpiry(token) <= Date.now()) {
    clearSession();
    return Promise.reject(new Error("Session expired. Please sign in again."));
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) clearSession();
    return Promise.reject(error);
  },
);
export function errorMessage(
  error: unknown,
  fallback = "Unable to complete request. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.error === "string") return data.error;
    if (data && typeof data === "object")
      return Object.entries(data)
        .map(
          ([key, value]) =>
            `${key}: ${Array.isArray(value) ? value.join(" ") : String(value)}`,
        )
        .join(" ");
    if (!error.response)
      return "Cannot reach the server. Check your connection and try again.";
  }
  return error instanceof Error ? error.message : fallback;
}
export default api;

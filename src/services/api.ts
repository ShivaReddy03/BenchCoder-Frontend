import axios from 'axios';
import { BASE_URL, USE_MOCK_FALLBACK } from './endpoints';

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' }, timeout: 8000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && !token.startsWith('mock-')) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** True when the error means "backend not there" (offline / 404) rather than a real API error. */
export const isUnavailable = (err: unknown) => {
  if (!axios.isAxiosError(err)) return false;
  return !err.response || err.response.status === 404 || err.response.status >= 500;
};

/**
 * Call the real endpoint; if it's missing (null) or the backend is unavailable,
 * return sample data instead. Real validation errors (400/401/403) are rethrown.
 */
export async function withFallback<T>(endpoint: unknown, call: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> {
  if (endpoint == null) return mock();
  try {
    return await call();
  } catch (err) {
    if (USE_MOCK_FALLBACK && isUnavailable(err)) {
      console.info('[api] using sample data:', (err as Error).message);
      return mock();
    }
    throw err;
  }
}

export const errorMessage = (err: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as Record<string, unknown> | undefined;
    if (d) {
      if (typeof d.detail === 'string') return d.detail;
      if (typeof d.error === 'string') return d.error;
      const first = Object.values(d)[0];
      if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
    }
  }
  return fallback;
};

export default api;

/**
 * ============================================================
 *  ALL BACKEND ENDPOINTS LIVE HERE — edit this one file only.
 * ============================================================
 *  - BASE_URL comes from VITE_API_URL (.env).
 *  - Set an endpoint to `null` if it doesn't exist yet: the app
 *    will use the sample data in src/services/mock/ instead.
 *  - If an endpoint exists but the server is unreachable, the
 *    app also falls back to sample data (when USE_MOCK_FALLBACK).
 */
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/** Serve sample data when the backend is offline / endpoint missing. */
export const USE_MOCK_FALLBACK = true;

export const ENDPOINTS = {
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    profile: '/auth/profile/',
  },
  problems: {
    list: '/problems/', // ?page=&limit=&search=&difficulty=
    detail: (id: number | string) => `/problems/${id}/`,
    create: '/problems/create/',
    addTestCase: (id: number | string) => `/problems/${id}/testcases/`,
    run: null as null | ((id: number | string) => string), // TODO backend: run code against sample tests
  },
  submissions: {
    list: '/submissions/',
    create: '/submissions/create/',
    detail: (id: number | string) => `/submissions/${id}/`,
    analyze: (id: number | string) => `/submissions/${id}/analyze/`,
  },
  stats: {
    me: null as null | string, // TODO backend: solved counts / streak
  },
} as const;

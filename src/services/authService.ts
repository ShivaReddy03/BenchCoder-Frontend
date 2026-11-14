import api, { withFallback } from './api';
import { ENDPOINTS } from './endpoints';

export interface RegisterData { username: string; email: string; password: string }
export interface LoginData { username: string; password: string }
export interface UserProfile { id: number; username: string; email: string; is_staff?: boolean }

const MOCK_USER_KEY = 'mockUser';

export const authService = {
  register: (data: RegisterData) =>
    withFallback(ENDPOINTS.auth.register, async () => (await api.post(ENDPOINTS.auth.register, data)).data, () => ({ ok: true })),

  login: async (data: LoginData) => {
    const res = await withFallback(ENDPOINTS.auth.login, async () => (await api.post(ENDPOINTS.auth.login, data)).data, () => {
      // Offline demo login: any username works; "admin" gets admin access.
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify({ id: 1, username: data.username, email: `${data.username}@demo.dev`, is_staff: data.username === 'admin' }));
      return { access: `mock-${Date.now()}` };
    });
    if (res.access) localStorage.setItem('authToken', res.access);
    return res;
  },

  getProfile: (): Promise<UserProfile> => {
    const token = localStorage.getItem('authToken') ?? '';
    if (token.startsWith('mock-')) return Promise.resolve(JSON.parse(localStorage.getItem(MOCK_USER_KEY) ?? '{}'));
    return api.get<UserProfile>(ENDPOINTS.auth.profile).then((r) => r.data);
  },

  logout: () => { localStorage.removeItem('authToken'); localStorage.removeItem(MOCK_USER_KEY); },
  isAuthenticated: () => !!localStorage.getItem('authToken'),
};

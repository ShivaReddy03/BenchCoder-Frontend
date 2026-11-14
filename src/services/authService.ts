import api, { clearSession, tokenExpiry } from "./api";
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  score: number;
  problems_solved: number;
}
export const authService = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => (await api.post("/auth/register/", data)).data,
  login: async (data: { username: string; password: string }) => {
    clearSession();
    const result = (
      await api.post<{
        access: string;
        user: UserProfile;
      }>("/auth/login/", data)
    ).data;
    localStorage.setItem("authToken", result.access);
    return result;
  },
  getProfile: async () => (await api.get<UserProfile>("/auth/profile/")).data,
  logout: clearSession,
  isAuthenticated: () =>
    tokenExpiry(localStorage.getItem("authToken") || "") > Date.now(),
};

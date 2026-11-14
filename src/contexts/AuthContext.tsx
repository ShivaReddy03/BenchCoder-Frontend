import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, UserProfile } from "@/services/authService";
import { AUTH_EXPIRED } from "@/services/api";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Failed to load user:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    if (!authService.isAuthenticated()) authService.logout();
    loadUser();
    const expired = () => setUser(null);
    const sync = () => {
      if (!authService.isAuthenticated()) {
        setUser(null);
        if (localStorage.getItem("authToken")) authService.logout();
      }
    };
    window.addEventListener(AUTH_EXPIRED, expired);
    window.addEventListener("storage", sync);
    const timer = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener(AUTH_EXPIRED, expired);
      window.removeEventListener("storage", sync);
      clearInterval(timer);
    };
  }, []);

  const login = async (username: string, password: string) => {
    await authService.login({ username, password });
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_staff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

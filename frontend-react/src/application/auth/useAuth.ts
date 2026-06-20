import { create } from "zustand";
import type { User } from "../../domain/user";

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

// Hydratation initiale depuis localStorage — survit au rechargement de page
function loadInitialUser(): User | null {
  const raw = localStorage.getItem("currentUser");
  return raw ? (JSON.parse(raw) as User) : null;
}

export const useAuth = create<AuthState>((set, get) => ({
  currentUser: loadInitialUser(),
  accessToken: localStorage.getItem("accessToken"),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(user));
    set({ currentUser: user, accessToken });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    set({ currentUser: null, accessToken: null });
  },

  isAuthenticated: () => get().accessToken !== null,
}));

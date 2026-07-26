// frontend/src/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

// 전역에서 로그인 유저 상태를 관리하는 스토어
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userName: null,
  login: (name) => set({ isLoggedIn: true, userName: name }),
  logout: () => set({ isLoggedIn: false, userName: null }),
}));

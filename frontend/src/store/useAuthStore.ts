import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null; // 백엔드 통신을 위해 유저 아이디(숫자) 상태 추가
  userName: string | null;
  login: (id: number, name: string) => void; // 로그인 시 아이디도 같이 받도록 수정
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  userName: null,
  login: (id, name) => set({ isLoggedIn: true, userId: id, userName: name }),
  logout: () => set({ isLoggedIn: false, userId: null, userName: null }),
}));

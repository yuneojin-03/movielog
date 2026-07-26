// frontend/src/components/layout/Header.tsx
import { useAuthStore } from "../../store/useAuthStore";

export const Header = () => {
  const { isLoggedIn, userName, logout } = useAuthStore();

  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <h1 className="text-xl font-bold">🎬 MovieLog</h1>
      <nav>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span>{userName}님</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">로그인이 필요합니다</span>
        )}
      </nav>
    </header>
  );
};

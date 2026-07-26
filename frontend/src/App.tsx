// frontend/src/App.tsx
import { Header } from "./components/layout/Header";
import { LoginUI } from "./components/auth/LoginUI";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        {/* 로그인 상태에 따라 UI를 조건부 렌더링합니다 */}
        {!isLoggedIn ? (
          <LoginUI />
        ) : (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-bold mb-2">영화 리뷰 피드</h2>
            <p className="text-gray-600">
              이제 이곳에 무한 스크롤이 들어갈 예정입니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

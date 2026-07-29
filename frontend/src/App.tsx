// frontend/src/App.tsx
import { Header } from "./components/layout/Header";
import { LoginUI } from "./components/auth/LoginUI";
import { HomeFeed } from "./components/feed/HomeFeed";
import { ReviewWriteUI } from "./components/review/ReviewWriteUI";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 max-w-2xl mx-auto space-y-10">
        {!isLoggedIn ? (
          <LoginUI />
        ) : (
          <>
            <ReviewWriteUI />
            <div>
              <h2 className="text-2xl font-bold mb-4">🔥 최신 리뷰 피드</h2>
              <HomeFeed />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

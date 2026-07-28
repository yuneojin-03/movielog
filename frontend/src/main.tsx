// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 서버 상태를 관리할 QueryClient 인스턴스 생성
const queryClient = new QueryClient();

async function enableMocking() {
  // Vite 환경에 맞는 환경 변수 문법으로 수정
  if (!import.meta.env.DEV) {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {/* App을 QueryClientProvider로 감싸줍니다 */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});

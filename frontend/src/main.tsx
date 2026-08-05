// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 서버 상태를 관리할 QueryClient 인스턴스 생성
const queryClient = new QueryClient();

// 가짜 데이터(MSW) 실행 코드를 모두 제거하고 곧바로 화면을 그리도록 수정
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* App을 QueryClientProvider로 감싸줍니다 */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

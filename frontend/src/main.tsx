// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 개발 환경일 때만 MSW를 실행하는 함수
async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // 방금 만든 browser.ts에서 워커를 불러옵니다
  const { worker } = await import("./mocks/browser");

  // 워커 시작!
  return worker.start();
}

// MSW가 완전히 켜진 후에 React 앱을 화면에 그립니다(렌더링)
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

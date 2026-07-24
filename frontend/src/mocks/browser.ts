// frontend/src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 핸들러를 포함한 워커 인스턴스 생성
export const worker = setupWorker(...handlers);

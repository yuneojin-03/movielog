// frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  // 지연된 값을 상태로 관리합니다.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 값을 업데이트하는 타이머를 설정합니다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 다음 값이 입력되거나 컴포넌트가 사라지면 이전 타이머를 취소(클린업)합니다.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

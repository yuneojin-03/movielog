// frontend/src/components/auth/LoginUI.tsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export const LoginUI = () => {
  // 모드 전환 상태 (true: 로그인 폼, false: 회원가입 폼)
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 입력 폼 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Zustand: 전역 로그인 함수 호출
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    console.log("💡 Auth UI(로그인/회원가입)가 마운트 되었습니다.");
    return () => console.log("💡 Auth UI가 언마운트 되었습니다.");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      return alert("이메일과 비밀번호를 모두 입력해주세요!");
    }

    if (isLoginMode) {
      // 로그인 처리 로직
      login(email);
    } else {
      // 회원가입 처리 로직 (Day 3 임시 구현: 가입 완료 후 바로 로그인 상태로 전환)
      alert("회원가입이 완료되었습니다!");
      login(email);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-slate-800">
        {isLoginMode ? "무비로그 로그인" : "무비로그 회원가입"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@movielog.com"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition duration-200 mt-2"
        >
          {isLoginMode ? "로그인" : "가입하기"}
        </button>
      </form>

      {/* 화면 전환 토글 버튼 */}
      <div className="text-center text-sm text-gray-600">
        {isLoginMode ? "아직 계정이 없으신가요? " : "이미 계정이 있으신가요? "}
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-blue-600 font-semibold hover:underline"
          type="button"
        >
          {isLoginMode ? "회원가입" : "로그인"}
        </button>
      </div>
    </div>
  );
};

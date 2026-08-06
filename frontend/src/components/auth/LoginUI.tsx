import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export const LoginUI = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 백엔드 요구사항에 맞춘 이름 상태 추가

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    console.log("Auth UI(로그인/회원가입)가 마운트 되었습니다.");
    return () => console.log("Auth UI가 언마운트 되었습니다.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      return alert("이메일과 비밀번호를 모두 입력해주세요!");
    }
    if (!isLoginMode && name.trim() === "") {
      return alert("이름을 입력해주세요!");
    }

    try {
      // 로그인 모드에 따라 통신할 백엔드 주소와 데이터 결정
      const endpoint = isLoginMode ? "login" : "register";
      const bodyData = isLoginMode
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`http://localhost:3000/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const data = await response.json();

        // 통신 성공 시 백엔드가 발급해준 id와 name을 Zustand 스토어에 저장
        login(data.id, data.name);
        alert(isLoginMode ? "로그인 성공!" : "회원가입 성공 및 로그인 완료!");
      } else {
        const errorData = await response.json();
        alert(`요청 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("서버와 통신 중 에러가 발생했습니다.");
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-slate-800">
        {isLoginMode ? "무비로그 로그인" : "무비로그 회원가입"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 회원가입 모드일 때만 이름 입력칸을 보여줌 */}
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

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
            placeholder="비밀번호 입력"
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

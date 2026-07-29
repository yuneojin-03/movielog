// frontend/src/components/review/ReviewWriteUI.tsx
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export const ReviewWriteUI = () => {
  // 영화 검색 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);

  // 방금 만든 Custom Hook 적용 (500ms 지연)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 리뷰 입력 상태
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  // 💡 디바운스 동작 확인용 useEffect
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(
        `📡 서버로 영화 검색 API 요청 전송: "${debouncedSearchTerm}"`,
      );
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-6">
      <h2 className="text-2xl font-bold mb-6">리뷰 작성하기</h2>

      {/* 영화 검색 및 선택 영역 */}
      {!selectedMovie ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            1단계: 영화 검색 및 선택
          </h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="영화 제목을 검색하세요 (예: 인사이드 아웃 2)"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {debouncedSearchTerm && (
            <div className="p-4 bg-slate-50 rounded-md border flex justify-between items-center">
              <span>
                검색 결과: <strong>{debouncedSearchTerm}</strong>
              </span>
              <button
                onClick={() => setSelectedMovie(debouncedSearchTerm)}
                className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
              >
                이 영화 선택
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 선택된 영화 리뷰 텍스트 및 별점 입력 영역 */
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              2단계: '{selectedMovie}' 리뷰 작성
            </h3>
            <button
              onClick={() => setSelectedMovie(null)}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              영화 다시 선택하기
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <label className="font-medium text-gray-700">별점:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border w-16 p-1 rounded text-center"
            />
            <span className="text-yellow-500">★</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 영화에 대한 솔직한 리뷰를 남겨주세요."
            className="w-full border p-3 rounded-md h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => alert("리뷰가 성공적으로 등록되었습니다!")}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700"
          >
            리뷰 등록하기
          </button>
        </div>
      )}
    </div>
  );
};

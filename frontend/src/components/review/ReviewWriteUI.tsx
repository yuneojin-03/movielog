// frontend/src/components/review/ReviewWriteUI.tsx
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuthStore } from "../../store/useAuthStore";

interface Movie {
  id: number;
  title: string;
  poster?: string;
}

export const ReviewWriteUI = () => {
  const { userId } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 백엔드에서 가져온 전체 영화 목록
  const [movies, setMovies] = useState<Movie[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  // 컴포넌트가 처음 켜질 때 백엔드에서 영화 목록 가져오기
  useEffect(() => {
    fetch("http://localhost:3000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("영화 목록 로드 실패:", err));
  }, []);

  // useEffect 없이 렌더링 과정에서 디바운스된 검색어로 실시간 필터링
  const searchResults = movies.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!selectedMovie) return;

    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          movieId: selectedMovie.id,
          content: content,
          rating: rating,
        }),
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        setContent("");
        setRating(5);
        setSelectedMovie(null);
        setSearchTerm("");
      } else {
        alert("리뷰 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-6">
      <h2 className="text-2xl font-bold mb-6">리뷰 작성하기</h2>

      {!selectedMovie ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            1단계: 영화 검색 및 선택
          </h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="영화 제목을 검색하세요"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="cursor-pointer border rounded-md p-2 hover:shadow-md transition-shadow flex flex-col items-center bg-gray-50"
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} 포스터`}
                    className="w-full h-36 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200 rounded flex items-center justify-center mb-2 text-gray-500 text-xs text-center p-2">
                    {movie.title} 포스터 (이미지 없음)
                  </div>
                )}
                <span className="text-sm font-medium text-center">
                  {movie.title}
                </span>
              </div>
            ))}
          </div>

          {searchResults.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              2단계: '{selectedMovie.title}' 리뷰 작성
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
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700"
          >
            리뷰 등록하기
          </button>
        </div>
      )}
    </div>
  );
};

// frontend/src/components/feed/HomeFeed.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Review {
  id: number;
  movieTitle: string;
  content: string;
  likes: number;
  isLiked: boolean;
}

export const HomeFeed = () => {
  const queryClient = useQueryClient();

  // 데이터 가져오기 (Fetch)
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/reviews");
      return res.json();
    },
  });

  // 낙관적 업데이트를 적용한 Mutation (좋아요 토글)
  const toggleLikeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:3000/reviews/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 }), // 가짜 유저 아이디 추가
      });
      return res.json();
    },
    // API 요청을 보내기 '직전'에 실행됨
    onMutate: async (targetId) => {
      // 진행 중인 재조회를 취소하여 데이터가 덮어씌워지는 것을 방지
      await queryClient.cancelQueries({ queryKey: ["reviews"] });

      // 만약 에러가 났을 때 되돌릴 수 있도록 이전 상태를 백업
      const previousReviews = queryClient.getQueryData<Review[]>(["reviews"]);

      // 서버 응답을 기다리지 않고 프론트엔드의 캐시 데이터를 즉시 변경 (낙관적 업데이트)
      queryClient.setQueryData<Review[]>(["reviews"], (oldData) => {
        return oldData?.map((review) => {
          if (review.id === targetId) {
            const isLikeAdded = !review.isLiked;
            const currentLikes = review.likes || 0;
            return {
              ...review,
              isLiked: isLikeAdded,
              likes: isLikeAdded ? currentLikes + 1 : currentLikes - 1,
            };
          }
          return review;
        });
      });

      // 에러 시 롤백을 위해 백업 데이터를 반환
      return { previousReviews };
    },
    // API 요청 실패 시 롤백
    onError: (_err, _targetId, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(["reviews"], context.previousReviews);
      }
      alert("좋아요 처리에 실패했습니다.");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 }), // 삭제할 때도 유저 아이디 필요
      });
      return res.json();
    },
    onSuccess: () => {
      // 삭제 성공 시 리뷰 목록을 다시 불러와서 화면을 갱신
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      alert("리뷰가 삭제되었습니다.");
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-10 font-bold text-gray-500">
        데이터를 불러오는 중입니다...
      </div>
    );

  return (
    <div className="flex flex-col gap-4 mt-6">
      {reviews?.map((review) => (
        <div
          key={review.id}
          className="p-4 border rounded-xl shadow-sm bg-white"
        >
          <h3 className="font-bold text-lg mb-2 text-slate-800">
            {review.movieTitle}
          </h3>
          <p className="text-gray-700 mb-4">{review.content}</p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-500">
              좋아요 {review.likes || 0}개
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLikeMutation.mutate(review.id)}
                className={`px-4 py-1 rounded-full border transition-colors ${
                  review.isLiked
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {review.isLiked ? "♥ 좋아요 취소" : "♡ 좋아요"}
              </button>
              <button
                onClick={() => deleteMutation.mutate(review.id)}
                className="px-4 py-1 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

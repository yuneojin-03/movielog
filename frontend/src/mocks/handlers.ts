// frontend/src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import type { Movie } from "../../../shared";

export const handlers = [
  // 영화 목록 조회를 위한 가짜 GET API
  http.get("/api/movies", () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "어벤져스: 둠스데이",
        director: "루소 형제",
        posterUrl: "https://example.com/avengers_doomsday.jpg",
        synopsis:
          "상상치 못한 새로운 위협에 맞서기 위해, 흩어졌던 멀티버스의 히어로들이 다시 모인다.",
        releaseDate: "2026-05-01",
      },
      {
        id: 2,
        title: "토이 스토리 5",
        director: "앤드류 스탠튼",
        posterUrl: "https://example.com/toystory5.jpg",
        synopsis:
          "디지털 시대에 맞서는 아날로그 장난감들! 우디와 버즈의 완전히 새로운 모험이 시작된다.",
        releaseDate: "2026-06-19",
      },
      {
        id: 3,
        title: "듄: 메시아",
        director: "드니 빌뇌브",
        posterUrl: "https://example.com/dune_messiah.jpg",
        synopsis:
          "황제가 된 폴 아크타이데스. 하지만 무앗딥의 이름으로 시작된 성전은 통제할 수 없는 방향으로 흘러가는데...",
        releaseDate: "2026-12-18",
      },
    ];

    return HttpResponse.json(mockMovies);
  }),
  // 홈 피드 리뷰 목록 API 추가
  http.get("/api/reviews", async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // 네트워크 지연 효과 (로딩 스피너 확인용)
    return HttpResponse.json([
      {
        id: 1,
        movieTitle: "인사이드 아웃 2",
        content: "너무 감동적이에요. 불안이가 제 모습 같았어요.",
        likes: 12,
        isLiked: false,
      },
      {
        id: 2,
        movieTitle: "듄: 파트 2",
        content: "올해 최고의 영화. 압도적인 시각 효과!",
        likes: 45,
        isLiked: false,
      },
    ]);
  }),

  // 좋아요 토글 API (낙관적 업데이트 테스트용)
  http.post("/api/reviews/:id/like", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 서버 처리 시간 가정
    return HttpResponse.json({ success: true });
  }),
];

// backend/src/reviews/reviews.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 리뷰 작성 API (POST /reviews)
  @Post()
  createReview(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('movieId', ParseIntPipe) movieId: number,
    @Body('content') content: string,
    @Body('rating', ParseIntPipe) rating: number,
  ) {
    return this.reviewsService.createReview(userId, movieId, content, rating);
  }

  // 특정 영화의 리뷰 목록 조회 API (GET /reviews/movie/:movieId)
  @Get('movie/:movieId')
  getReviewsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.reviewsService.getReviewsByMovie(movieId);
  }

  // 전체 리뷰 목록 조회 API (GET /reviews)
  @Get()
  getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  // 리뷰 삭제 API (DELETE /reviews/:reviewId)
  @Delete(':reviewId')
  deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.reviewsService.deleteReview(reviewId, userId);
  }
  // 좋아요 토글 API (POST /reviews/:reviewId/like)
  @Post(':reviewId/like')
  toggleLike(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.reviewsService.toggleLike(reviewId, userId);
  }
}

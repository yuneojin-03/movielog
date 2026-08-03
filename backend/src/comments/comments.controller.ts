// backend/src/comments/comments.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 작성 API (POST /comments)
  @Post()
  createComment(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('reviewId', ParseIntPipe) reviewId: number,
    @Body('content') content: string,
  ) {
    return this.commentsService.createComment(userId, reviewId, content);
  }

  // 특정 리뷰의 댓글 목록 조회 API (GET /comments/review/:reviewId)
  @Get('review/:reviewId')
  getCommentsByReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.commentsService.getCommentsByReview(reviewId);
  }

  // 댓글 삭제 API (DELETE /comments/:commentId)
  @Delete(':commentId')
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.commentsService.deleteComment(commentId, userId);
  }
}

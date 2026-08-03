// backend/src/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 댓글 생성 로직
  async createComment(userId: number, reviewId: number, content: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });

    if (!user || !review) {
      throw new NotFoundException('유저 또는 리뷰를 찾을 수 없습니다.');
    }

    const newComment = this.commentsRepository.create({
      content,
      user,
      review,
    });
    return await this.commentsRepository.save(newComment);
  }

  // 특정 리뷰의 댓글 목록 조회 로직
  async getCommentsByReview(reviewId: number) {
    return await this.commentsRepository.find({
      where: { review: { id: reviewId } },
      relations: { user: true }, // TypeORM 최신 문법(객체 형태) 적용!
    });
  }

  // 댓글 삭제 로직
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: { user: true },
    });

    if (!comment || comment.user.id !== userId) {
      throw new NotFoundException(
        '삭제할 권한이 없거나 댓글이 존재하지 않습니다.',
      );
    }

    await this.commentsRepository.remove(comment);
    return { message: '댓글이 성공적으로 삭제되었습니다.' };
  }
}

// backend/src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Movie } from '../entities/movie.entity';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  // 리뷰 생성 로직
  async createReview(
    userId: number,
    movieId: number,
    content: string,
    rating: number,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
    });

    if (!user || !movie) {
      throw new NotFoundException('유저 또는 영화 정보를 찾을 수 없습니다.');
    }

    const newReview = this.reviewsRepository.create({
      content,
      rating,
      user,
      movie,
    });
    return await this.reviewsRepository.save(newReview);
  }

  // 특정 영화의 리뷰 목록 조회 로직
  async getReviewsByMovie(movieId: number) {
    return await this.reviewsRepository.find({
      where: { movie: { id: movieId } },
      relations: { user: true },
    });
  }

  // 리뷰 삭제 로직
  async deleteReview(reviewId: number, userId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: { user: true },
    });

    if (!review || review.user.id !== userId) {
      throw new NotFoundException(
        '삭제할 권한이 없거나 리뷰가 존재하지 않습니다.',
      );
    }

    await this.reviewsRepository.remove(review);
    return { message: '리뷰가 성공적으로 삭제되었습니다.' };
  }

  // 좋아요 토글(Toggle) 로직 추가
  async toggleLike(reviewId: number, userId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!review || !user) {
      throw new NotFoundException('리뷰나 유저를 찾을 수 없습니다.');
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await this.likesRepository.findOne({
      where: { review: { id: reviewId }, user: { id: userId } },
    });

    if (existingLike) {
      // 이미 눌렀다면 취소(삭제)
      await this.likesRepository.remove(existingLike);
      return { message: '좋아요가 취소되었습니다.' };
    } else {
      // 안 눌렀다면 추가(생성)
      const newLike = this.likesRepository.create({ review, user });
      await this.likesRepository.save(newLike);
      return { message: '좋아요가 추가되었습니다.' };
    }
  }
}

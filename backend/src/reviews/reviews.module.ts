// backend/src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from '../entities/review.entity';
import { Movie } from '../entities/movie.entity';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity'; // Like 엔티티 불러오기

@Module({
  // forFeature 배열 안에 Like를 꼭 추가해 줘!
  imports: [TypeOrmModule.forFeature([Review, Movie, User, Like])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

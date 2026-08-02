// backend/src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity'; // Day 6에 만들어둔 Movie 엔티티

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]), // 데이터베이스(Movie 테이블) 연결
    HttpModule, // 외부 API 통신을 위한 모듈
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

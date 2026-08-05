// backend/src/movies/movies.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';

// 👇 외부 API 응답 데이터의 생김새(타입)를 정의해 준다.
interface KoficResponse {
  boxOfficeResult: {
    dailyBoxOfficeList: Array<{
      movieNm: string;
    }>;
  };
}

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return await this.moviesRepository.find();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async fetchDailyBoxOffice() {
    this.logger.log('매일 자정: 박스오피스 데이터 업데이트 시작');

    const apiKey = 'YOUR_KOFIC_API_KEY_HERE';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDt = yesterday.toISOString().slice(0, 10).replace(/-/g, '');

    const url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${targetDt}`;

    try {
      // get<KoficResponse>(url) 처럼 우리가 만든 타입을 지정해 주면 에러가 사라진다!
      const response = await lastValueFrom(
        this.httpService.get<KoficResponse>(url),
      );
      const movieList = response.data.boxOfficeResult.dailyBoxOfficeList;

      for (const movieData of movieList) {
        let movie = await this.moviesRepository.findOne({
          where: { title: movieData.movieNm },
        });

        if (!movie) {
          movie = this.moviesRepository.create({
            title: movieData.movieNm,
          });
          await this.moviesRepository.save(movie);
        }
      }
      this.logger.log('박스오피스 데이터 업데이트 완료');
    } catch (error) {
      this.logger.error('외부 API 연동 중 에러 발생', error);
    }
  }
}

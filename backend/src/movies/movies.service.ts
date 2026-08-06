import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface KoficResponse {
  boxOfficeResult: {
    dailyBoxOfficeList: Array<{
      movieNm: string;
    }>;
  };
}

// TMDB 응답 타입을 새로 추가합니다.
interface TmdbResponse {
  results: Array<{
    poster_path: string | null;
  }>;
}

@Injectable()
export class MoviesService implements OnModuleInit {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('서버 부팅 즉시 영화 데이터를 가져옵니다.');
    await this.fetchDailyBoxOffice();
  }

  async findAll(): Promise<Movie[]> {
    return await this.moviesRepository.find();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async fetchDailyBoxOffice() {
    this.logger.log('매일 자정: 박스오피스 데이터 업데이트 시작');

    const koficApiKey = this.configService.get<string>('KOFIC_API_KEY');
    const tmdbApiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!koficApiKey || !tmdbApiKey) {
      this.logger.error('API 키가 설정되지 않았습니다.');
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDt = yesterday.toISOString().slice(0, 10).replace(/-/g, '');

    const koficUrl = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${koficApiKey}&targetDt=${targetDt}`;

    try {
      const koficResponse = await lastValueFrom(
        this.httpService.get<KoficResponse>(koficUrl),
      );
      const movieList = koficResponse.data.boxOfficeResult.dailyBoxOfficeList;

      for (const movieData of movieList) {
        const title = movieData.movieNm;
        let movie = await this.moviesRepository.findOne({
          where: { title: title },
        });

        if (!movie) {
          let posterUrl: string | null = null;

          // TMDB API를 통해 영화 제목으로 포스터 이미지 검색
          const tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&language=ko-KR&query=${encodeURIComponent(title)}`;

          try {
            const tmdbResponse = await lastValueFrom(
              this.httpService.get<TmdbResponse>(tmdbSearchUrl),
            );

            const results = tmdbResponse.data.results;
            if (results && results.length > 0 && results[0].poster_path) {
              // TMDB는 이미지의 뒷부분 경로만 제공하므로 앞에 기본 주소를 붙여주어야 합니다.
              posterUrl = `https://image.tmdb.org/t/p/w500${results[0].poster_path}`;
            }
          } catch (tmdbError) {
            this.logger.error(
              `TMDB API 연동 중 에러 발생 (영화: ${title})`,
              tmdbError,
            );
          }

          // 영화 정보와 찾아낸 포스터 주소를 함께 데이터베이스에 저장
          movie = this.moviesRepository.create({
            title: title,
            poster: posterUrl, // 엔티티에 poster 컬럼이 있어야 정상 작동합니다.
          });
          await this.moviesRepository.save(movie);
        }
      }
      this.logger.log('박스오피스 및 포스터 데이터 업데이트 완료');
    } catch (error) {
      this.logger.error('외부 API 연동 중 에러 발생', error);
    }
  }
}

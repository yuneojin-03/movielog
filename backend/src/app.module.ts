// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // ⚠️ 본인의 MySQL 유저명으로 수정한다
      password: 'password', // ⚠️ 본인의 MySQL 비밀번호로 수정한다
      database: 'movielog_db',
      entities: [User, Review],
      synchronize: true, // 개발 환경 전용: Entity 변경 시 DB 테이블 자동 동기화
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

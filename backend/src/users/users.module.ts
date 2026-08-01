// backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User 엔티티(DB 테이블) 연결
    JwtModule.register({
      global: true,
      secret: 'super-secret-key', // ⚠️ 실제 배포 시에는 .env 파일로 숨겨야 하는 비밀키야
      signOptions: { expiresIn: '1h' }, // 토큰 유효 기간: 1시간
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

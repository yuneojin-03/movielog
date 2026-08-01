// backend/src/users/users.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. 회원가입 로직
  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // 이미 가입된 이메일인지 확인
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 암호화 (bcrypt 사용)
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 새 유저 저장
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.usersRepository.save(user);
    return { message: '회원가입이 완료되었습니다.' };
  }

  // 2. 로그인 로직
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // 이메일로 유저 찾기
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 입력한 비밀번호와 DB의 암호화된 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password); // <-- 에러 발생 예상 지점? (User 엔티티에 password가 없다면)
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 비밀번호가 맞다면 JWT 토큰(출입증) 발급
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: '로그인 성공',
      accessToken,
    };
  }
}

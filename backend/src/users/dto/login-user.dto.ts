// backend/src/users/dto/login-user.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력값입니다.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
  password!: string;
}

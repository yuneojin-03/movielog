// backend/src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력값입니다.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
  name!: string;
}

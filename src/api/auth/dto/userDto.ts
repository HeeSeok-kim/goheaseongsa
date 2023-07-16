import { IsNotEmpty, IsString, Length } from 'class-validator';

export class userDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 100)
  loginId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nickName: string;
}

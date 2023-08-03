import { IsNotEmpty, IsString, Length } from 'class-validator';

export class userDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  loginId: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  name: string;
}

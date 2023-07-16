import { IsNotEmpty, IsString } from 'class-validator';

export class signInDto {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

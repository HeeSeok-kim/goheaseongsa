import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class updatePostsDto {
  @IsNumberString()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  template: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}

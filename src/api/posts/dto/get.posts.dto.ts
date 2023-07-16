import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class getPostsDto {
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsString()
  search?: number;
}

import { IsNumber, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class detailPostsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  postId: number;
}

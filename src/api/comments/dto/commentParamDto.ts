import { IsNumber, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommentParamDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  commentId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  postId: number;
}

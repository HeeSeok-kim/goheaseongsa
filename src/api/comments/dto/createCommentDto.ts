import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '../../../database/user.entity';
import { Post } from '../../../database/post.entity';

export class createCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  user: User;
  post: Post;
}

import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';
import { JwtAuthGuard } from '../../auth/strategy/jwt/jwt.auth.guard';

@Controller('/posts/:postId')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Put('likes')
  async postLike(@Param() param: detailPostsDto, @Req() req) {
    return this.likesService.postLike(param, req.user);
  }
}

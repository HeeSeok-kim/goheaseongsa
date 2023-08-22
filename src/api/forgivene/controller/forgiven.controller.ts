import { Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategy/jwt/jwt.auth.guard';
import { ForgiveService } from '../service/forgiven.service';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';

@Controller('/posts/:postId')
export class ForgiveController {
  constructor(private readonly forgiveService: ForgiveService) {}

  @UseGuards(JwtAuthGuard)
  @Put('forgive')
  async forgive(@Param() param: detailPostsDto, @Req() req) {
    return this.forgiveService.forgive(param, req.user);
  }
}

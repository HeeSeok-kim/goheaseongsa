import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { createCommentDto } from '../dto/createCommentDto';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';
import { CommentService } from '../service/comment.service';
import { JwtAuthGuard } from '../../auth/strategy/jwt/jwt.auth.guard';

@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createdComment(
    @Param() param: detailPostsDto,
    @Body() body: createCommentDto,
    @Req() req,
  ) {
    return this.commentService.createComment(param, body, req.user);
  }

  @Delete()
  async deleteComment() {}

  @Put()
  async updateComment() {}
}

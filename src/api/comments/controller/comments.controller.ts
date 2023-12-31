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
import { CommentParamDto } from '../dto/commentParamDto';

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

  @Delete(':commentId')
  async deleteComment(@Param() param: CommentParamDto, @Req() req) {
    return this.commentService.deleteComment(param, req.user);
  }

  @Put(':commentId')
  async updateComment(
    @Param() param: CommentParamDto,
    @Req() req,
    @Body() body: createCommentDto,
  ) {
    return this.commentService.updateComment(param, req.user, body);
  }
}

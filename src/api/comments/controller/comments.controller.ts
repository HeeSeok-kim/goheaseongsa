import { Body, Controller, Param, Post } from '@nestjs/common';
import { createCommentDto } from '../dto/createCommentDto';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';
import { CommentService } from '../service/comment.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createdPosts(
    @Param() param: detailPostsDto,
    @Body() body: createCommentDto,
  ) {
    return this.commentService.createComment(param, body);
  }
}

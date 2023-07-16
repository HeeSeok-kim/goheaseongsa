import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { getPostsDto } from '../dto/get.posts.dto';
import { createPostsDto } from '../dto/create.posts.dto';
import { updatePostsDto } from '../dto/update.posts.dto';
import { PostsService } from '../service/posts.service';
import { detailPostsDto } from '../dto/detail.posts.dto';
import { JwtAuthGuard } from '../../auth/strategy/jwt/jwt.auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(@Query() query: getPostsDto) {
    return this.postService.getPosts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createdPosts(@Body() body: createPostsDto, @Req() req) {
    return this.postService.createdPosts(body, req.user);
  }

  @Get(':postId')
  async getDetailPost(@Param() param: detailPostsDto) {
    return this.postService.getDetailPost(param);
  }

  @Put(':postId')
  async updatePosts(
    @Param() param: detailPostsDto,
    @Body() body: updatePostsDto,
  ) {
    return { param };
  }
}

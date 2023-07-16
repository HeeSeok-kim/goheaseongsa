import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { getPostsDto } from '../dto/get.posts.dto';
import { createPostsDto } from '../dto/create.posts.dto';
import { updatePostsDto } from '../dto/update.posts.dto';
import { PostsService } from '../service/posts.service';
import { detailPostsDto } from '../dto/detail.posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(@Query() query: getPostsDto) {
    return this.postService.getPosts(query);
  }

  @Post()
  async createdPosts(@Body() body: createPostsDto) {
    return this.postService.createdPosts(body);
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

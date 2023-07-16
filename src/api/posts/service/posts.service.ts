import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { getPostsDto } from '../dto/get.posts.dto';
import { createPostsDto } from '../dto/create.posts.dto';
import { detailPostsDto } from '../dto/detail.posts.dto';
import { updatePostsDto } from '../dto/update.posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../../database/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  async getPosts(query: getPostsDto) {
    const { page, search } = query;
    const take = 5;
    return this.postRepository.find({
      take,
      skip: (page - 1) * take,
      order: {
        createAt: 'DESC',
      },
    });
  }

  async createdPosts(body: createPostsDto) {
    return this.postRepository.save(body);
  }

  async getDetailPost(param: detailPostsDto) {
    const { postId } = param;
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'post',
        'comment.commentId',
        'comment.comment',
        'comment.createAt',
        'comment.updateAt',
        'user.nickName',
      ])
      .where('post.postId = :postId', { postId })
      .getOne();
  }

  async updatePosts(param: detailPostsDto, body: updatePostsDto) {
    return param;
  }
}

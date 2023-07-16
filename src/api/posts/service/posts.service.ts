import {
  HttpStatus,
  Injectable,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { getPostsDto } from '../dto/get.posts.dto';
import { createPostsDto } from '../dto/create.posts.dto';
import { detailPostsDto } from '../dto/detail.posts.dto';
import { updatePostsDto } from '../dto/update.posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../../database/post.entity';
import { Repository } from 'typeorm';
import { User } from '../../../database/user.entity';
import { throwHttpException } from '../../../common/error/error.handler';
import { ERROR_MESSAGES } from '../../../common/constant/error-messages';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getPosts(query: getPostsDto) {
    const { page, search } = query;
    const take = 5;
    const skip = (page - 1) * take;
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .select(['post', 'user.name'])
      .skip(skip)
      .take(take)
      .orderBy('post.createAt', 'DESC')
      .getMany();

    return { data: result };
  }

  async createdPosts(body: createPostsDto, req) {
    const user = await this.userRepository.findOne({
      where: { userId: req.userId },
    });

    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    body.user = user;
    const savedPost = await this.postRepository.save(body);

    const result = {
      postId: savedPost.postId,
      title: savedPost.title,
      content: savedPost.content,
      createAt: savedPost.createAt,
      updateAt: savedPost.updateAt,
    };

    return { data: result, message: '게시글 작성 완료!' };
  }

  async getDetailPost(param: detailPostsDto) {
    const { postId } = param;
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .select([
        'post',
        'user.name',
        'comment.commentId',
        'comment.comment',
        'commentUser.name',
        'comment.createAt',
        'comment.updateAt',
      ])
      .where('post.postId = :postId', { postId })
      .getOne();
    return { data: result };
  }

  async updatePosts(param: detailPostsDto, body: updatePostsDto) {
    return param;
  }
}

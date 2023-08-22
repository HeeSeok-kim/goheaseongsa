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
import { SUCCESS_MESSAGE } from '../../../common/constant/success-message';
import { Like } from '../../../database/like.entity';
import { Forgive } from '../../../database/forgive.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Forgive)
    private readonly forgiveRepository: Repository<Forgive>,
  ) {}
  async getPosts(query: getPostsDto) {
    const { page, search, limit } = query;
    const take = limit ? limit : 12;
    const skip = (page - 1) * take;
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('post.like', 'like')
      .leftJoinAndSelect('post.forgive', 'forgive')
      .loadRelationCountAndMap('post.commentCount', 'post.comment')
      .loadRelationCountAndMap('post.likeCount', 'post.like')
      .loadRelationCountAndMap('post.forgiveCount', 'post.forgive')
      .select(['post', 'user.name', 'user.nickName'])
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

    return { data: result, message: SUCCESS_MESSAGE.POST };
  }

  async getDetailPost(param: detailPostsDto, user) {
    const { postId } = param;
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .select([
        'post',
        'user.name',
        'user.nickName',
        'comment.commentId',
        'comment.comment',
        'commentUser.name',
        'comment.createAt',
        'comment.updateAt',
      ])
      .where('post.postId = :postId', { postId })
      .getOne();
    const likeCount = await this.likeRepository.count({
      where: { post: { postId: postId } },
    });
    const forgiveCount = await this.forgiveRepository.count({
      where: { post: { postId: postId } },
    });
    result['isLike'] = false;
    result['isForgive'] = false;
    result['likeCount'] = likeCount;
    result['forgiveCount'] = forgiveCount;

    if (user) {
      const likeUser = await this.likeRepository.findOne({
        where: {
          post: { postId: postId },
          user: { userId: user.userId },
        },
      });
      const forgiveUser = await this.forgiveRepository.findOne({
        where: {
          post: { postId: postId },
          user: { userId: user.userId },
        },
      });
      result['isLike'] = likeUser ? true : false;
      result['isForgive'] = forgiveUser ? true : false;
    }

    return { data: result };
  }

  async myPost(user) {
    try {
      const { userId } = user;
      const result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.comment', 'comment')
        .leftJoinAndSelect('post.like', 'like')
        .leftJoinAndSelect('post.forgive', 'forgive')
        .loadRelationCountAndMap('post.commentCount', 'post.comment')
        .loadRelationCountAndMap('post.likeCount', 'post.like')
        .loadRelationCountAndMap('post.forgiveCount', 'post.forgive')
        .select(['post', 'user.name', 'user.nickName'])
        .where('user.userId = :userId', { userId })
        .orderBy('post.createAt', 'DESC')
        .getMany();
      return { data: result };
    } catch (error) {
      throwHttpException(ERROR_MESSAGES.POST_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePosts(param: detailPostsDto, body: updatePostsDto) {
    return param;
  }
}

import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/user.entity';
import { Post } from '../../../database/post.entity';
import { Like } from '../../../database/like.entity';
import { throwHttpException } from '../../../common/error/error.handler';
import { ERROR_MESSAGES } from '../../../common/constant/error-messages';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async postLike(param, req) {
    const post = await this.postRepository.findOne({
      where: { postId: param.postId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: req.userId },
    });
    const like = await this.likeRepository
      .createQueryBuilder('like')
      .where('like.userId = :userId', { userId: user.userId })
      .andWhere('like.postId = :postId', { postId: post.postId })
      .getOne();

    if (!post) {
      throwHttpException(ERROR_MESSAGES.POST_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    let result;

    if (like) {
      result = await this.likeRepository.remove(like);
      return {
        message: '좋아요를 취소 하였습니다.',
      };
    } else {
      const likeData = new Like();
      likeData.user = user;
      likeData.post = post;
      result = await this.likeRepository.save(likeData);
      return {
        message: '좋아요 버튼을 눌렀습니다.',
      };
    }
  }
}

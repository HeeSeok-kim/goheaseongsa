import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../../database/post.entity';
import { Repository } from 'typeorm';
import { User } from '../../../database/user.entity';
import { Forgive } from '../../../database/forgive.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwHttpException } from '../../../common/error/error.handler';
import { ERROR_MESSAGES } from '../../../common/constant/error-messages';

@Injectable()
export class ForgiveService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Forgive) private forgiveRepository: Repository<Forgive>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async forgive(param, req) {
    const post = await this.postRepository.findOne({
      where: { postId: param.postId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: req.userId },
    });

    const forgive = await this.forgiveRepository
      .createQueryBuilder('forgive')
      .where('forgive.userId = :userId', { userId: user.userId })
      .andWhere('forgive.postId = :postId', { postId: post.postId })
      .getOne();

    if (!post) {
      throwHttpException(ERROR_MESSAGES.POST_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (forgive) {
      await this.forgiveRepository.remove(forgive);
      return {
        message: '용서를 취소 하였습니다.',
      };
    } else {
      const forgiveData = new Forgive();
      forgiveData.user = user;
      forgiveData.post = post;
      await this.forgiveRepository.save(forgiveData);
      return {
        message: '용서 버튼을 눌렀습니다.',
      };
    }
  }
}

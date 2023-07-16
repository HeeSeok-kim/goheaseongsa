import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../../database/comment.entity';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';
import { createCommentDto } from '../dto/createCommentDto';
import { Post } from '../../../database/post.entity';
import { User } from '../../../database/user.entity';
import { throwHttpException } from '../../../common/error/error.handler';
import { ERROR_MESSAGES } from '../../../common/constant/error-messages';
import { CommentParamDto } from '../dto/commentParamDto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createComment(param: detailPostsDto, body: createCommentDto, req) {
    const post = await this.postRepository.findOne({
      where: { postId: param.postId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: req.userId },
    });

    if (!post) {
      throwHttpException(ERROR_MESSAGES.POST_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    body.user = user;
    body.post = post;
    const savedComment = await this.commentRepository.save(body);
    const result = {
      commentId: savedComment.commentId,
      comment: savedComment.comment,
      createAt: savedComment.createAt,
      updateAt: savedComment.updateAt,
    };

    return { data: result, message: '댓글이 생성되었습니다.' };
  }

  async deleteComment(param: CommentParamDto, req) {
    const post = await this.postRepository.findOne({
      where: { postId: param.postId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: req.userId },
    });
    const comment = await this.commentRepository.findOne({
      where: { commentId: param.commentId },
      relations: ['user'],
    });

    if (!post) {
      throwHttpException(ERROR_MESSAGES.POST_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!comment) {
      throwHttpException(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (comment.user.userId !== req.userId) {
      throwHttpException(
        ERROR_MESSAGES.COMMENT_NOT_DELETE,
        HttpStatus.BAD_REQUEST,
      );
    }
    const deleteComment = await this.commentRepository.remove(comment);
    const result = {
      comment: deleteComment.comment,
    };
    return { data: result, message: '삭제되었습니다.' };
  }
}

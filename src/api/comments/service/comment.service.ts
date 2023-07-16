import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../../database/comment.entity';
import { detailPostsDto } from '../../posts/dto/detail.posts.dto';
import { createCommentDto } from '../dto/createCommentDto';
import { Post } from '../../../database/post.entity';
import { User } from '../../../database/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}
  async createComment(param: detailPostsDto, body: createCommentDto) {
    const newComment = this.commentRepository.create();
    newComment.comment = body.comment;
    newComment.post = { ...param } as Post;
    newComment.user = { userId: body.userId } as User;

    return this.commentRepository.save(newComment);
    //   this.commentRepository.create({ ...param, ...body }),
    // );
    // return newComment;
  }
}

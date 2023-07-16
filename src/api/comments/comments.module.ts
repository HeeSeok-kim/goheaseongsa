import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './controller/comments.controller';
import { Comment } from '../../database/comment.entity';
import { Post } from '../../database/post.entity';
import { User } from '../../database/user.entity';
import { CommentService } from './service/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
  controllers: [CommentsController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}

import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../database/post.entity';
import { User } from '../../database/user.entity';
import { Like } from '../../database/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

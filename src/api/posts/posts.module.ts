import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../database/post.entity';
import { User } from '../../database/user.entity';
import { Like } from '../../database/like.entity';
import { Forgive } from '../../database/forgive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like, Forgive])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

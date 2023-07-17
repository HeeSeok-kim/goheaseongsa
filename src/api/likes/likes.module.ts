import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../database/post.entity';
import { User } from '../../database/user.entity';
import { Like } from '../../database/like.entity';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}

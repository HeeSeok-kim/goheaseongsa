import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../database/post.entity';
import { User } from '../../database/user.entity';
import { Forgive } from '../../database/forgive.entity';
import { ForgiveController } from './controller/forgiven.controller';
import { ForgiveService } from './service/forgiven.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Forgive])],
  controllers: [ForgiveController],
  providers: [ForgiveService],
  exports: [ForgiveService],
})
export class ForgivenModule {}

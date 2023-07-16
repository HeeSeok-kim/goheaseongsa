import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user.entity';
import { Comment } from './database/comment.entity';
import { Forgive } from './database/forgive.entity';
import { Like } from './database/like.entity';
import { Post } from './database/post.entity';
import { PostsModule } from './api/posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { CommentsModule } from './api/comments/comments.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    PostsModule,
    CommentsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Comment, Forgive, Like, Post],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

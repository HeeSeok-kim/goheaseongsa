import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Forgive } from './forgive.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: true })
  loginId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: false })
  isAdmin: boolean;

  @Column({ nullable: false })
  grade: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => Forgive, (forgive) => forgive.user)
  forgive: Forgive[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];
}

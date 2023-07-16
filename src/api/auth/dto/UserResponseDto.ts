import { User } from '../../../database/user.entity';

export class UserResponseDto {
  userId: number;
  loginId: string;

  static of(user: User): UserResponseDto {
    return {
      // ERROR!
      userId: user.userId,
      loginId: user.loginId,
    };
  }
}

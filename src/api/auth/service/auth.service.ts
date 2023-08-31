import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { userDto } from '../dto/userDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dto/UserResponseDto';
import { JwtService } from '@nestjs/jwt';
import { throwHttpException } from '../../../common/error/error.handler';
import { ERROR_MESSAGES } from '../../../common/constant/error-messages';
import { SUCCESS_MESSAGE } from '../../../common/constant/success-message';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(
    @Body() body: userDto,
  ): Promise<{ data: UserResponseDto; message: string }> {
    const { loginId, password } = body;
    const user = await this.userRepository.findOne({ where: { loginId } });

    if (user) {
      throwHttpException(ERROR_MESSAGES.USER_OVERLAP, HttpStatus.CONFLICT);
    }

    const newUser = {
      ...body,
      nickName: '익명의머쓱이',
      isAdmin: false,
      grade: 0,
    };
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    newUser.password = hashedPassword;

    const result = await this.userRepository.save(newUser);

    return {
      data: UserResponseDto.of(result),
      message: `${result.loginId} 이 정상적으로 생성되었습니다.`,
    };
  }

  async signIn(req) {
    const { userId, loginId, name } = req.user;
    const payload = { userId: userId, loginId: loginId };
    const token = {
      access_token: `Bearer ${this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '999d',
      })}`,
      user: {
        userId,
        loginId,
        name,
      },
    };
    return { data: token, message: SUCCESS_MESSAGE.LOGIN };
  }

  async validateUser(loginId, password) {
    const user = await this.userRepository.findOne({ where: { loginId } });

    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const isLogin = await bcrypt.compare(password, user.password);
    if (!isLogin) {
      throwHttpException(ERROR_MESSAGES.LOGIN_FAILED, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async deleteUser(req) {
    const data = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ loginId: '', password: '' })
      .where('userId = :id', { id: req.userId })
      .execute();

    if (!data.affected) {
      throwHttpException(
        ERROR_MESSAGES.DELETE_NOT_FAIL,
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: SUCCESS_MESSAGE.USER_DELETE };
  }

  async editPassword(body, req) {
    const { password } = body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where('userId = :id', { id: req.userId })
      .execute();

    if (!data.affected) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_EDIT, HttpStatus.BAD_REQUEST);
    }

    return { message: SUCCESS_MESSAGE.EDIT_USER };
  }
}

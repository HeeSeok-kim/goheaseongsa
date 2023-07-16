import { Body, Injectable } from '@nestjs/common';
import { userDto } from '../dto/userDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dto/UserResponseDto';
import { signInDto } from '../dto/singInDto';
import { JwtService } from '@nestjs/jwt';

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
      throw user;
    }
    const newUser = {
      ...body,
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
    const { userId, loginId } = req.user;
    const payload = { userId: userId, loginId: loginId };
    const token = {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '24h',
      }),
    };
    return { data: token, message: '로그인 성공' };
  }

  async validateUser(loginId, password) {
    const user = await this.userRepository.findOne({ where: { loginId } });

    if (!user) {
      throw new Error('존재하지 않은 유저입니다.');
    }

    const isLogin = await bcrypt.compare(password, user.password);
    if (!isLogin) {
      throw new Error('로그인 실패 아이디 혹은 패스워드를 다시 확인해주세요!');
    }

    return user;
  }
}

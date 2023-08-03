import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { userDto } from '../dto/userDto';
import { AuthService } from '../service/auth.service';
import { UserResponseDto } from '../dto/UserResponseDto';
import { signInDto } from '../dto/singInDto';
import { LocalAuthGuard } from '../strategy/local/local.auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() body: userDto,
  ): Promise<{ data: UserResponseDto; message: string }> {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  @UseGuards(AuthGuard('local'))
  async signIn(@Req() req) {
    return this.authService.signIn(req);
  }
}

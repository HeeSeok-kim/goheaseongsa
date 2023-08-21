import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { userDto } from '../dto/userDto';
import { AuthService } from '../service/auth.service';
import { UserResponseDto } from '../dto/UserResponseDto';
import { signInDto } from '../dto/singInDto';
import { LocalAuthGuard } from '../strategy/local/local.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../strategy/jwt/jwt.auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Delete('/user')
  async deleteUser(@Req() req) {
    return this.authService.deleteUser(req.user);
  }

  @Put('/password')
  @UseGuards(JwtAuthGuard)
  async editPassword(@Body() body, @Req() req) {
    return this.authService.editPassword(body, req.user);
  }
}

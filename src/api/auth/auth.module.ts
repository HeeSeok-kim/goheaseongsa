import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/user.entity';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local/local.strategy';
import { JwtStrategy } from './strategy/jwt/jwt.strategy';
import { OptionalJwtAuthGuard } from './strategy/jwt/jwt.option.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, OptionalJwtAuthGuard],
  exports: [AuthService, JwtStrategy, PassportModule, OptionalJwtAuthGuard],
})
export class AuthModule {}

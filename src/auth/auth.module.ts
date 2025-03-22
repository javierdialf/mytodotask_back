import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule} from '@nestjs/jwt';
import { EncoderService } from 'src/auth/encoder.service';
import { UsersModule } from 'src/users/users.module';
import { AuthTokensService } from './auth.tokens.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailService } from './email.service';
import { ResetToken } from './entities/reset-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetService } from './password-reset.service';
import { ENVS_JWT } from 'config';
import { JwtResetPasswordStrategy } from './strategies/jwt-reset-token-password.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([ResetToken]),
    JwtModule.register({
        secret: ENVS_JWT.jwt_secret_key_access,
        signOptions: {
          expiresIn: ENVS_JWT.jwt_access_token_expiration,
        },
    }),
    
    UsersModule],
  controllers: [AuthController],
  providers: [AuthTokensService, AuthService, EncoderService, EmailService, PasswordResetService, LocalStrategy, JwtStrategy, JwtResetPasswordStrategy]
})
export class AuthModule {}
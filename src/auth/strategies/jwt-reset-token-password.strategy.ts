import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVS_JWT } from 'config';
import { NAMES } from 'src/common/constants/names.constants';
import { PasswordResetService } from '../password-reset.service';
import { JwtPayload } from '../types/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, 'jwt-reset-token-password') {
  constructor(private readonly passwordResetService: PasswordResetService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter(NAMES.RESET_PASSWORD_TOKEN),
      ignoreExpiration: false,
      secretOrKey: ENVS_JWT.jwt_secret_key_reset,
      passReqToCallback: true
    });
  }

  
  async validate(req: Request, jwtPayload: JwtPayload) {
    const resetToken = req.query['reset_token'];
    await this.passwordResetService.validateResetTokenPassword(resetToken.toString())
    return jwtPayload;
  }
}

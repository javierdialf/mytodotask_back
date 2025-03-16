import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayloadDto } from '../dto/jwt-payload.dto';
import { ENVS_JWT } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENVS_JWT.jwt_secret_key_access,
    });
  }

  validate(payload: jwtPayloadDto) {
    return payload;
  }
}

import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayloadDto } from './dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { Repository } from 'typeorm';
import { ENVS_JWT } from 'src/config';


@Injectable()
export class AuthTokensService {
    constructor(
        @InjectRepository(ResetToken) private readonly ResetTokenRepository: Repository<ResetToken>,
        private jwtService: JwtService) {}


    public generateAuthToken(payload: jwtPayloadDto): string {
        const tokenGenerated = this.jwtService.sign(payload, {
                secret: ENVS_JWT.jwt_secret_key_access,
                expiresIn: ENVS_JWT.jwt_access_token_expiration
            });
        return tokenGenerated;
    }    



    /*rehacer metodo de generacion de refresh token, MAS TARDE
    genJwtRefreshToken(payload: jwtPayloadDto) {
        try{
            const refresh_token = this.jwtService.signAsync(payload,{
                secret: 'laprimerasede',
                expiresIn: '3m'
            });

            return refresh_token;
        } catch(error) {
            return error;
        }
    }
    */


}
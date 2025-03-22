import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { Repository } from 'typeorm';
import { ErrorMessage } from 'src/common';
import { JwtGenerationPayload } from './types/jwt-generate-token.interface';
import { JwtPayload } from './types/jwt-payload.interface';


@Injectable()
export class AuthTokensService {
    constructor(
        @InjectRepository(ResetToken) private readonly ResetTokenRepository: Repository<ResetToken>,
        private jwtService: JwtService) {}


    public generateAuthToken({sub, id ,secret, expiresIn }: JwtGenerationPayload): string {
        try {
            const claims = id ? {sub, id} : {sub};
            const tokenGenerated = this.jwtService.sign(claims, {
                secret,
                expiresIn
            });

            return tokenGenerated;
        } catch (error) {
            throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
        }
    }    


    public decodeToken(token: string): JwtPayload {
        const decodedToken = this.jwtService.decode(token);
        if (!decodedToken) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
        
        return decodedToken;
    }

    public async getResetPasswordTokenByToken(resetPasswordtoken: string): Promise<ResetToken | null> {
        try {
        const resetTokenPasswordFound: ResetToken = await this.ResetTokenRepository.findOne({where: {token: resetPasswordtoken}});
        if(!resetTokenPasswordFound) return null;
        return resetTokenPasswordFound

        } catch (error) {
            throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
        }
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
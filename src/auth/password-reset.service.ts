import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { ResetToken } from "./entities/reset-token.entity";
import { Repository } from "typeorm";
import { EmailService } from "./email.service";
import { EncoderService } from "./encoder.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { DataResponseDto, ErrorMessage } from "src/common";
import { INSTITUCIONAL_EMAIL_REGEX } from "src/common/constants/regex.contants";
import { ENVS_JWT } from "config";
import { AuthTokensService } from "./auth.tokens.service";



@Injectable()
export class PasswordResetService {
    constructor(@InjectRepository(ResetToken) private readonly resetTokenRepository: Repository<ResetToken>,
                private readonly userService: UsersService,
                private readonly encoderService: EncoderService,
                private readonly mailService: EmailService,
                private readonly authTokensService: AuthTokensService) {}

                

    public async generatePasswordResetToken(userEmail: string): Promise<DataResponseDto<void>> {
        const passwordResetToken = this.authTokensService.generateAuthToken({
            sub: userEmail,
            secret: ENVS_JWT.jwt_secret_key_reset,
            expiresIn: ENVS_JWT.jwt_reset_password_token_expiration
        });

        const decodedToken = this.authTokensService.decodeToken(passwordResetToken);
        const createdAt: number = decodedToken.iat;
        const expiresIn: number = decodedToken.exp;
        
        const tokenCreated = this.resetTokenRepository.create({
            email: userEmail,
            token: passwordResetToken,
            createdAt: new Date(createdAt * 1000),
            expiresIn: new Date(expiresIn * 1000)
        });
        await this.resetTokenRepository.save(tokenCreated);
        
        
        const result: boolean = await this.mailService.sendResetPasswordEmail(userEmail, passwordResetToken);
        if (!result) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR('failed to send password reset email'));
        
        return {
            message: 'an email was sent to your email address to reset your password.',
            data: null
        }
    }

    
    public async resetPassword(resetPasswordToken: string, newPassword: string): Promise<DataResponseDto<void>> {
        const userEmail = this.authTokensService.decodeToken(resetPasswordToken).sub;
        if (!userEmail) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);

        const userFound = await this.userService.findUserByEmail(userEmail);

        const deleteResult = await this.resetTokenRepository.createQueryBuilder()
        .delete()
        .from(ResetToken, 'reset_tokens')
        .where('reset_tokens.token = :token', {token: resetPasswordToken})
        .execute();

        if(!deleteResult.affected) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);

        const hashedPassword = await this.encoderService.encodePassword(newPassword)
        await this.userService.changePassword(userFound.id, hashedPassword);

         return {
            message: 'password successfully restored, you can now log in.',
            data: null
         }
    }


    public async changePassword(userId: string, {oldPassword, newPassword}: ChangePasswordDto): Promise<DataResponseDto<void>> {
        const userFound = await this.userService.findUserById(userId);
        if (!userFound) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('user'));

        const matchPassword: boolean = this.encoderService.matchPassword(oldPassword, userFound.password);
        if (!matchPassword) throw new ForbiddenException(ErrorMessage.WRONG_CREDENTIALS);
  
        const hashedNewPassword = await this.encoderService.encodePassword(newPassword);
           
        return this.userService.changePassword(userId, hashedNewPassword);
      }



      public async validateUserResetPassword(userEmail: string) {
        this.isInstitutionalEmail(userEmail);
        const userFound = await this.userService.findUserByEmail(userEmail)
        if (!userFound) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('user'));
      }


      public async validateResetTokenPassword(resetPasswordToken: string) {
        const tokenFound = await this.authTokensService.getResetPasswordTokenByToken(resetPasswordToken);
        if (!tokenFound) throw new ForbiddenException();
      }
      

       private isInstitutionalEmail(email: string): void {
              if (!INSTITUCIONAL_EMAIL_REGEX.test(email)) throw new BadRequestException(ErrorMessage.ONLY_INSTITUTIONAL_EMAILS); 
        }
}
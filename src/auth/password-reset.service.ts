import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { ResetToken } from "./entities/reset-token.entity";
import { Repository } from "typeorm";
import { EmailService } from "./email.service";
import { EncoderService } from "./encoder.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { DataResponseDto, ErrorMessage } from "src/common";



@Injectable()
export class PasswordResetService {
    constructor(@InjectRepository(ResetToken) private readonly resetTokenRepository: Repository<ResetToken>,
                private readonly userService: UsersService,
                private readonly encoderService: EncoderService,
                private readonly mailService: EmailService,
                private readonly jwtService: JwtService) {}

                
    public async generatePasswordResetToken(userEmail: string): Promise<void> {
        await this.userService.findUserByEmail(userEmail);

        const passwordResetToken = this.jwtService.sign({userEmail}, {expiresIn: '1m'});

        const decodedToken = this.jwtService.decode(passwordResetToken);
        if (!decodedToken) throw new Error(ErrorMessage.OPERATION_FAILED_ERROR);;
        const createdAt: number = decodedToken.iat;
        const expiresIn: number = decodedToken.exp;
        
        const tokenCreated = this.resetTokenRepository.create({
            email: userEmail,
            token: passwordResetToken,
            createdAt: new Date(createdAt * 1000),
            expiresIn: new Date(expiresIn * 1000)
        });

        await this.resetTokenRepository.save(tokenCreated);
        
        this.mailService.sendResetPasswordEmail(userEmail, passwordResetToken); 
    }

    
    public async resetPassword(resetPasswordToken: string, newPassword: string): Promise<DataResponseDto<void>> {
        const userEmail = this.jwtService.decode(resetPasswordToken).userEmail;
        if (!userEmail) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);

        const userFound = await this.userService.findUserByEmail(userEmail);

        const deleteResult = await this.resetTokenRepository.createQueryBuilder()
        .delete()
        .from(ResetToken, 'reset_tokens')
        .where('reset_tokens.token = :token', {token: resetPasswordToken})
        .execute();

        if(!deleteResult.affected) throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);

        const hashedPassword = await this.encoderService.encodePassword(newPassword)
        this.userService.changePassword(userFound.id, hashedPassword);

         return {
            message: 'password successfully restored, you can now log in.',
            data: null
         }
    }


    public async changePassword(userId: string, {oldPassword, newPassword}: ChangePasswordDto): Promise<DataResponseDto<void>> {
        const userFound = await this.userService.findUserById(userId);
  
        const matchPassword: boolean = this.encoderService.matchPassword(oldPassword, userFound.password);
        if (!matchPassword) throw new ForbiddenException(ErrorMessage.WRONG_CREDENTIALS);
  
        const hashedNewPassword = await this.encoderService.encodePassword(newPassword);
           
        return this.userService.changePassword(userId, hashedNewPassword);
      }
      
}
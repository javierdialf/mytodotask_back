import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Query, Request, UseGuards, Headers, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { createUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/public.decorator';
import { LocalGuard } from './guards/local.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { getCurrentUserId } from './decorators/getCurrentUserId.decorator';
import { DataResponseDto } from 'src/common';
import { PasswordResetService } from './password-reset.service';
import { ValidateUserResetPasswordInterceptor } from './interceptors/validate-user-reset-password.interceptor';
import { JwtResetPasswordGuard } from './guards/jwt-reset-token-passwod.guard';
import { ResetTokenPasswordDto } from './dto/reset-token-password.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly passwordResetService: PasswordResetService) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @IsPublic()
    @Post('/login')
    login(@Request() req: any) {
      return this.authService.singIn(req.user);
    }

    
    @IsPublic()
    @Post('/register')
    async register(@Body() createUserDto: createUserDto) {
      return await this.authService.register(createUserDto);
    }

    /*
    en reparacion hasta tiempo indefinido, ni yo se hasta cuando
      @Post('/refreshToken')
    refreshToken(){ 
    }
    */

    @Patch('/change-password')
    public async changePassword(@getCurrentUserId() userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<DataResponseDto<void>>  {
        return await this.passwordResetService.changePassword(userId, changePasswordDto);
    }



    @HttpCode(HttpStatus.OK)
    @UseInterceptors(ValidateUserResetPasswordInterceptor)
    @IsPublic()
    @Post('/forgot-password')
    public async forgotPassword(@Headers() headers: any): Promise<DataResponseDto<void>> {
      const userEmail = headers['user-email'];
      return await this.passwordResetService.generatePasswordResetToken(userEmail);
    }


    @UseGuards(JwtResetPasswordGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @IsPublic()
    @Patch('/reset-password')
    public async resetPassword(@Query() { resetToken }: ResetTokenPasswordDto, @Body() {newPassword}: {newPassword: string}): Promise<DataResponseDto<void>> {
      return await this.passwordResetService.resetPassword(resetToken, newPassword);
    }
}

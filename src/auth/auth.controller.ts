import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Query, Request, UseGuards, Headers } from '@nestjs/common';
import { createUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/public.decorator';
import { LocalGuard } from './guards/local.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { getCurrentUserId } from './decorators/getCurrentUserId.decorator';
import { DataResponseDto } from 'src/common';
import { PasswordResetService } from './password-reset.service';
import { ResetPasswordGuard } from './guards/reset-password.guard';


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



    @IsPublic()
    @UseGuards(ResetPasswordGuard)
    @Post('/forgot-password')
    public async forgotPassword(@Headers() headers: any): Promise<string> {
      const userEmail = headers['user-email'];
      await this.passwordResetService.generatePasswordResetToken(userEmail);
      return 'bacano se envio todo'
    }

    @IsPublic()
    @Patch('/reset-password')
    public async resetPassword(@Query() {reset_token}: {reset_token: string}, @Body() {newPassword}: {newPassword: string}): Promise<DataResponseDto<void>> {
      return await this.passwordResetService.resetPassword(reset_token, newPassword);
    }
}

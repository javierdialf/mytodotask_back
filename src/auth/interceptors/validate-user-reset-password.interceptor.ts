import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PasswordResetService } from '../password-reset.service';

@Injectable()
export class ValidateUserResetPasswordInterceptor implements NestInterceptor {
  constructor( private readonly passwordResetService: PasswordResetService) {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const headers = context.switchToHttp().getRequest().headers;
    const userEmail = headers['user-email'];
    if (!userEmail) throw new ForbiddenException();
    
    await this.passwordResetService.validateUserResetPassword(userEmail);

    return next.handle();
  }
}

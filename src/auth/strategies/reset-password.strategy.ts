/*

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy} from "passport-local";
import { PasswordResetService } from "../password-reset.service";


@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(Strategy, 'reset-password') {
     constructor(private readonly passwordResetService: PasswordResetService){
        super({
            usernameField: 'userEmail',
        });
     }

  async validate(userEmail: string) {
      const user = await this.passwordResetService.generatePasswordResetToken(userEmail);
      if (!user) throw new UnauthorizedException();
      return user;
     } 
     
}*/
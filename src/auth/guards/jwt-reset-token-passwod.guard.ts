import {ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtResetPasswordGuard extends AuthGuard('jwt-reset-token-password') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
         return super.canActivate(context);
     }
}



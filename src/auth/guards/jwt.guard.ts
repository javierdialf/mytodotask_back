import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
       const IsPublic = this.reflector.getAllAndOverride('IsPublic', [
            context.getHandler(),
            context.getClass()
        ]);
        
        if (IsPublic) return true
        return super.canActivate(context);
    }
}
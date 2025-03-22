import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.interface";



export const getCurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    const jwtPayload: JwtPayload = req?.user;
    console.log(jwtPayload);
    return jwtPayload?.id;
});

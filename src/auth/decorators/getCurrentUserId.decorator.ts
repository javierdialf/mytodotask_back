import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtPayloadDto } from "../dto/jwt-payload.dto";


export const getCurrentUserId = createParamDecorator((data: unknown,context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    const payload: jwtPayloadDto = req?.user;
    return payload?.id;
});

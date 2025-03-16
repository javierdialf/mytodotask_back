import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, throwError} from "rxjs";
import { EstructureResponseDto } from "../dto/estructure-response.dto";



@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, EstructureResponseDto<T>> {

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<EstructureResponseDto<T>> | Promise<Observable<EstructureResponseDto<T>>> {

        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            catchError((error: HttpException) => 
                throwError(() => this.errorHandler(error, context)),
            ));
        }


        errorHandler(exception: HttpException, context: ExecutionContext): void {
            const ctx = context.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();

            const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

           const message = exception instanceof HttpException
           ? exception.getResponse()
           : new InternalServerErrorException('Internal Server Error');

            const errorMessage = message['message']
            response.status(status).json({
                status: false,
                statusCode: status,
                path: request.url,
                message: errorMessage,
                exception: exception || "UnknownException",
                timestamp: new Date().toISOString()
            });
        }


        responseHandler(res: any, context: ExecutionContext): EstructureResponseDto<T> {
            const ctx = context.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const statusCode = response.statusCode

            return {
                status: true,
                statusCode,
                path: request.url,
                message: res.message,
                data: res.data,
                timestamp: new Date()
            }
        }
    
}
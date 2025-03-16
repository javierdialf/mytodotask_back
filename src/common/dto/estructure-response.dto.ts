export class EstructureResponseDto<T> {
    status: boolean;
    statusCode: number;
    path: string;
    message: string;
    data: T | T[];
    timestamp: Date;
}
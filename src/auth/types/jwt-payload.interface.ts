

export interface JwtPayload {
    sub: string;
    id?: string

    iat: number;

    exp: number;
}
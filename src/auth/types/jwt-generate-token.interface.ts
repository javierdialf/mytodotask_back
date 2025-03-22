
export class JwtGenerationPayload {
    sub: string;
    id?: string
    secret: string;
    expiresIn: string
}
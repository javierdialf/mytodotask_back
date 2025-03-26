import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncoderService {
    //cambiar esto despues
    salt: number = 10;
    public encodePassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, this.salt);
    }
    

    public matchPassword(PlanePassword: string, hashepassword: string): boolean {
        return bcrypt.compareSync(PlanePassword, hashepassword);
    }
}
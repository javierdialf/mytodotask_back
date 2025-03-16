import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncoderService {
    //veriificar si es mejor el salt definido o generado por getsalt
    salt: number = 10;
    public encodePassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, this.salt);
    }
    

    public matchPassword(PlanePassword: string, hashepassword: string): boolean {
        return bcrypt.compareSync(PlanePassword, hashepassword);
    }
}
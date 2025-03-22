import { Injectable} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import {VerifyCallback} from 'passport-google-oauth2';

/*
@Injectable()
export class googleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(config: ConfigService) {
        super({
           clientId: config.get<string>('GOOGLE_CLIENT_ID'),
           scope: ['email', 'profile']
         });
    }

    validate(accessToken: string, refeshToken: string, profile: any, done: VerifyCallback) {
        const {id, name, lastname, email, photo} = profile;
        const user = {
            provider: 'google',
            providerId: id,
            email: email[0].value,
            name: name.givenName,
            lastname: name.familyName,
            photo: photo[0].values
        }

        done(null, user);
    }
}
*/
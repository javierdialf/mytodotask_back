import { BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import { AuthTokensService } from "./auth.tokens.service";
import { User } from "src/users/entities/users.entity";
import { UsersService } from "src/users/users.service";
import { createUserDto } from "src/auth/dto/create-user.dto";
import { ConflictException } from "@nestjs/common";
import { EncoderService } from "./encoder.service";
import { credentialUserDto } from "./dto/credential-user.dto";
import { LoginResponseDto } from "./dto/response-login.dto";
import { DataResponseDto, ErrorMessage} from "src/common";
import { UserMapperService } from "src/users/mapper/user-mapper.service";
import { ResponseUserDto } from "src/users/dto/response-user.dto";
import { INSTITUCIONAL_EMAIL_REGEX } from "src/common/constants/regex.contants";
import { JwtGenerationPayload } from "./types/jwt-generate-token.interface";
import { ENVS_JWT } from "config";




@Injectable()
export class AuthService {
    constructor(
        private readonly authTokensService: AuthTokensService, 
        private readonly usersService: UsersService,
        private readonly userMapperService: UserMapperService,
        private readonly encoderService: EncoderService) {}


    public async singIn(user: User): Promise<DataResponseDto<LoginResponseDto>> {
           const jwtPayload: JwtGenerationPayload = {  
                sub: user.email,
                id: user.id,
                secret: ENVS_JWT.jwt_secret_key_access,
                expiresIn: ENVS_JWT.jwt_access_token_expiration
            };
            
            const token = this.authTokensService.generateAuthToken(jwtPayload);
            return {
                message: 'successful login',
                data: {
                        content: {
                        accessToken: token,
                        user: this.userMapperService.toUserResponse(user)
                    }
                }
            };
    }


    public async register({email, password,  ...data}: createUserDto): Promise<DataResponseDto<LoginResponseDto>> {
        this.isInstitutionalEmail(email);
        const userAlreadyExist = await this.usersService.findUserByEmail(email);
        if (userAlreadyExist) throw new ConflictException('the email already has an account');

        const hashedPassword = await this.encoderService.encodePassword(password);
        const userCreated = await this.usersService.createUser({password: hashedPassword, email: email, ...data});
        return this.singIn(userCreated);
    }


    public async validateUser({email, password}: credentialUserDto): Promise<ResponseUserDto> {
        this.isInstitutionalEmail(email);
        const userFound: User = await this.usersService.findUserByEmail(email);
        if (!userFound) throw new ForbiddenException();

        const matchPassword: boolean = this.encoderService.matchPassword(password, userFound.password);
        if (!matchPassword) throw new ForbiddenException(ErrorMessage.WRONG_CREDENTIALS);

        return this.userMapperService.toUserResponse(userFound);
    }


    private isInstitutionalEmail(email: string): void {
        if (!INSTITUCIONAL_EMAIL_REGEX.test(email)) throw new BadRequestException(ErrorMessage.ONLY_INSTITUTIONAL_EMAILS); 
    }

 }
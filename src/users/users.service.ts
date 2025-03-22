import { Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/users.entity';
import { createUserDto } from '../auth/dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { DataResponseDto, ErrorMessage, SuccessMessage } from 'src/common';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserMapperService } from './mapper/user-mapper.service';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
                private readonly userMapperService: UserMapperService) {}

    
    public async createUser(createUserDto: createUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(newUser);
    }


    public async findUserById(userId: string): Promise<User | null> {
        const userFound: User = await this.usersRepository.findOneBy({id: userId});
        if (!userFound) return null;
        return userFound;
    }
    

    public async findUserByEmail(userEmail: string): Promise<User | null> {
        const userFound: User = await this.usersRepository.findOneBy({email: Equal(userEmail)});
        if (!userFound) return null;
        return userFound;
    }
    


    public async updateUser(userId: string, updateUserDto: updateUserDto): Promise<DataResponseDto<ResponseUserDto>> {
        if (!await this.findUserById(userId)) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('user',userId));
        
        const result: UpdateResult = await this.usersRepository
            .createQueryBuilder()
            .update(User)
            .set(updateUserDto)
            .where("id = :id", { id: userId })
            .execute();
        
            if (result.affected) return {
                message: SuccessMessage.OBJECT_SUCCESS_ACCTION('user', 'updated'),
                data: {
                    content: this.userMapperService.toUserResponse(await this.findUserById(userId))
                }
        }
    }



    public async changePassword(userId: string, newPassword: string): Promise<DataResponseDto<void>> {
        if (!await this.findUserById(userId)) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('user',userId));
        const result = await this.usersRepository
            .createQueryBuilder()
            .update(User)
            .set({password: newPassword})
            .where("users.id = :id", {id: userId})
            .execute();

            if (result.affected) {
                return {
                    message: SuccessMessage.OBJECT_SUCCESS_ACCTION('password', 'updated'),
                    data: null
                }
            } 

            throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
    }



    public async deleteUser(userId: string): Promise<DataResponseDto<string>> {
        if (!await this.findUserById(userId)) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('user',userId));

        const result:DeleteResult =  await this.usersRepository
        .createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :id", { id: userId })
            .execute()

            if ((result).affected === 1) {
                return {
                    message: SuccessMessage.OBJECT_SUCCESS_ACCTION('user', 'deleted'),
                    data: null
                }
            }
    }
}

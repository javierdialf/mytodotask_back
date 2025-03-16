import { Body, Controller, Delete,  Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { DataResponseDto } from 'src/common';
import { NotesService } from 'src/notes/notes.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Patch('update/:id')
    async updatedUser(@Body() dataUpdate: updateUserDto, @Param('id') id: string): Promise<DataResponseDto<ResponseUserDto>> {
        return await this.usersService.updateUser(id, dataUpdate);
    }

    
    @Delete('/delete/:id')
    async deleteUser(@Param('id') id: string): Promise<DataResponseDto<string>> {
        return await this.usersService.deleteUser(id);
    }
}

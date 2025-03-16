import { Body, Controller,Get, HttpCode, HttpStatus, Post,Patch, Delete, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { getCurrentUserId } from 'src/auth/decorators/getCurrentUserId.decorator';
import { DataResponseDto, PaginationDto } from 'src/common';
import { ResponseNoteDto } from './dto/response-note.dto';


@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

        @HttpCode(HttpStatus.CREATED)
        @Post('/create')
        public async createNote(@getCurrentUserId() userId: string, @Body() createNoteDto: CreateNoteDto): Promise<DataResponseDto<ResponseNoteDto>> {
            return await this.notesService.createNote(userId, createNoteDto);
        }


        @Get('/notesUser')
        @UsePipes(new ValidationPipe({transform: true}))
        public async getNotesUser(@getCurrentUserId() userId: string, @Query() paginationDto: PaginationDto): Promise<DataResponseDto<ResponseNoteDto[]>> {
            return await this.notesService.getNotesUser(userId, paginationDto);
        }

        @Patch('/update/:id')
        public async updateNote(@getCurrentUserId() userId: string, @Param('id') noteId: string, @Body() data: UpdateNoteDto): Promise<DataResponseDto<ResponseNoteDto>> {
            return await this.notesService.updateNote(userId, noteId, data);
        }

        
        @Delete('/delete/:id')
        public async deleteNote(@getCurrentUserId() userId: string, @Param('id') noteId: string): Promise<DataResponseDto<void>> {
            return await this.notesService.deleteNote(userId, noteId);
        }


        @Get('/trash')
        public async Trash(@getCurrentUserId() userId: string): Promise<ResponseNoteDto[]> {
            return this.notesService.trashNotes(userId);
        }

}

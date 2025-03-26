import { BadRequestException,  Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/notes.entity';
import { DeleteResult, Repository} from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DataResponseDto, DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, PaginationDto, PermissionService, SuccessMessage } from '../common';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ResponseNoteDto } from './dto/response-note.dto';
import { NoteMapperService } from 'src/notes/mapper/note-mapper.service';
import { isUUID } from 'class-validator';
import { ErrorMessage } from '../common';



@Injectable()
export class NotesService {
    constructor(@InjectRepository(Note) private notesRepository: Repository<Note>,
     private readonly usersService: UsersService,
     private readonly noteMapperService: NoteMapperService,
     private readonly permissionService: PermissionService)  {}


   public async createNote(currentUserId: string, {userId, ...createNoteDto}: CreateNoteDto): Promise<DataResponseDto<ResponseNoteDto>> {
    this.permissionService.verifyUser(currentUserId, userId)
    const userCreator: User = await this.usersService.findUserById(currentUserId)
        const newNote = this.notesRepository.create({user: userCreator, ...createNoteDto});
        return {
            message: SuccessMessage.OBJECT_SUCCESS_ACCTION('note', 'created'),
            data: {
                content: this.noteMapperService.toNoteResponse(await this.notesRepository.save(newNote))
            }
        };
    }


    private async findNoteById(noteId: string): Promise<ResponseNoteDto> {
        if ((!isUUID(noteId))) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('note', noteId));
        const noteFound: Note = await this.notesRepository.findOne({
            where: {id: noteId},
            loadRelationIds: true
        });

        if (!noteFound) throw new NotFoundException(ErrorMessage.OBJECT_NOT_FOUND('note', noteId));
        return this.noteMapperService.toNoteResponse(noteFound);
    }
    

    public async getNotesUser(currentUserId: string, {page, limit}: PaginationDto): Promise<DataResponseDto<ResponseNoteDto[]>> {
        page = page ?? DEFAULT_PAGE;
        limit = limit ?? DEFAULT_PAGE_LIMIT;

        const userNotesAndCount: [Note[], number] = await this.notesRepository
        .findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: {user: {id: currentUserId}},
            loadRelationIds: true
          });

        const totalData: number = userNotesAndCount[1];
                                   
        if (totalData === 0) {
            if (page > 1) throw new NotFoundException();
            return {data: {content: []}}
        }

        const totalpages = Math.ceil(totalData / limit);
        if (page > totalpages) throw new NotFoundException();

        
          const responseNotes: ResponseNoteDto[] = userNotesAndCount[0].map(note => this.noteMapperService.toNoteResponse(note));
            return {
                data: {
                    content: responseNotes,
                    metadata: {
                    totalPages: totalpages,
                    currentPage: page,
                    limit: limit
                    }
                }
            }
     }



   public async updateNote(currentUserId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<DataResponseDto<ResponseNoteDto>> {
     if (Object.keys(updateNoteDto).length == 0) throw new BadRequestException(ErrorMessage.DATA_NOT_EMPTY);
    
     const noteToUpdate = await this.findNoteById(noteId);
        this.permissionService.verifyUser(currentUserId, noteToUpdate.userId);

            const noteUpdated = await this.notesRepository
            .createQueryBuilder()
            .update(Note)
            .set(updateNoteDto)
            .where("notes.id = :id", {id: noteId})
            .execute();
            
            if (noteUpdated.affected) return {
                message: SuccessMessage.OBJECT_SUCCESS_ACCTION('note', 'updated', noteId),
                data: {
                    content: await this.findNoteById(noteId)
                }
            };
            throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
        }


    async deleteNote(currentUserId: string, noteId: string): Promise<DataResponseDto<void>> {
        const noteToDelete: ResponseNoteDto = await this.findNoteById(noteId);
            this.permissionService.verifyUser(currentUserId, noteToDelete.userId);

            const deleteResult: DeleteResult = await this.notesRepository
                .createQueryBuilder()
                .delete()
                .from(Note, 'notes')
                .where('notes.id = :id', {id: noteId})
                .execute();

            if (deleteResult.affected) return {
                message: SuccessMessage.OBJECT_SUCCESS_ACCTION('note', 'deleted'),
                data: null
            }

            throw new InternalServerErrorException(ErrorMessage.OPERATION_FAILED_ERROR);
    }


//esta es la funcion para ver las notas de la papelera, pero aun no esta lista, falta modificarla
    async trashNotes(currentUserId: string): Promise<any[]> {
        const notesInTrash:Note[] = await this.notesRepository
            .createQueryBuilder()
            .select('notes')
            .from(Note, 'notes')
            .where('notes.user_id = :user_id', {user_id: currentUserId})
            .getMany();

        return notesInTrash;
    }
  
}



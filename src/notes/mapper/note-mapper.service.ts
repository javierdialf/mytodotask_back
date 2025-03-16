import { ResponseNoteDto } from "src/notes/dto/response-note.dto";
import { Note } from "src/notes/entities/notes.entity";
import { User } from "src/users/entities/users.entity";

export class NoteMapperService {
    
    public toNoteResponse({user, ...note}: Note): ResponseNoteDto {
        return {
            ...note,
            userId: user instanceof User ? user.id : user
        }
    }
}
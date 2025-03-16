import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/notes.entity';
import { NoteMapperService } from './mapper/note-mapper.service';
import { PermissionService } from 'src/common';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UsersModule],
  providers: [NotesService, NoteMapperService,PermissionService],
  controllers: [NotesController],
})
export class NotesModule {}
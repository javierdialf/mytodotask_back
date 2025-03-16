import { Module } from '@nestjs/common';
import { Trash } from './entities/trash.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trash])],
  controllers: [TrashController],
  providers: [TrashService],
  exports: []
})
export class TrashModule {}

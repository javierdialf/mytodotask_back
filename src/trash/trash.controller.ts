import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrashService } from './trash.service';
import { getCurrentUserId } from 'src/auth/decorators/getCurrentUserId.decorator';
import { DeleteResult } from 'typeorm';

@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Delete('restore/:id')
  async remove(@getCurrentUserId() userId: string, @Param('id') dataId: string): Promise<DeleteResult> {
      return await this.trashService.restoreData(userId, dataId);
  }

  @Get('trashUser')
  async get(@getCurrentUserId() userId: string) {
    return await this.trashService.getUserTrash(userId);
  }
}

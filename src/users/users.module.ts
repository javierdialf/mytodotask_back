import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapperService } from './mapper/user-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserMapperService],
  controllers: [UsersController],
  exports: [UsersService, UserMapperService]
})
export class UsersModule {

  
}

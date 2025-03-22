import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { ConfigModule} from '@nestjs/config';
import { RemindersModule } from './reminders/reminders.module';
import {JwtAuthGuard} from './auth/guards/jwt.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TrashModule } from './trash/trash.module';
import { ENVS_DATABASE } from '../config';
import { ResponseInterceptor } from './common';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: () => ({
          type: 'mysql',
          host: ENVS_DATABASE.db_host,
          port: ENVS_DATABASE.db_port,
          username: ENVS_DATABASE.db_username,
          password: ENVS_DATABASE.db_password,
          database: ENVS_DATABASE.database,
          entities: [__dirname + '/**/*.entity.js'],
        }),
      }),

    UsersModule,
    AuthModule,
    NotesModule,
    RemindersModule,
    TrashModule
  ],


  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
  ],

})
export class AppModule {}



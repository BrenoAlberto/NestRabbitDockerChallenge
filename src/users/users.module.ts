import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarsService } from './avatars/avatars.service';
import { RegresService } from './regres/regres.service';
import { AvatarSchema } from './avatars/schema/avatar.schema';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AvatarFilesService } from './avatars/avatar-files.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'users_queue',
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Avatar', schema: AvatarSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AvatarsService, AvatarFilesService, RegresService],
  exports: [],
})
export class UsersModule {}

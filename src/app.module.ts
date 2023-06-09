import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@mongo:27018', {
      dbName: 'payever',
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

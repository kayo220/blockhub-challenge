import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:root@cluster0.p9wcd.mongodb.net/test'),
    UsersModule]

})
export class AppModule { }

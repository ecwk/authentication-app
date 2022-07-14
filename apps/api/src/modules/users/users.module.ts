import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IsEmailExistConstraint } from './decorators';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, IsEmailExistConstraint],
  exports: [UsersService]
})
export class UsersModule {}

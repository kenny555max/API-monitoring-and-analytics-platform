import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersMicroserviceController],
  providers: [UsersService],
})
export class UsersModule {}

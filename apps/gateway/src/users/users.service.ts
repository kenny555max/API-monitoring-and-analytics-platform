import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  create() {
    return 'This action adds a new user';
  }

  update() {
    return `This action updates a user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

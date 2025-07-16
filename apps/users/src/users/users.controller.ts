import {Controller} from '@nestjs/common';
import {EventPattern, MessagePattern, Payload, RpcException} from '@nestjs/microservices';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from "./entities/user.entity";
import {UserAlreadyExistsException} from "./exceptions";

@Controller()
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  async create(@Payload() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new RpcException({
          // statusCode: error.statusCode || 400,
          code: error.errorCode || 'EMAIL_ALREADY_EXISTS',
          message: error.message || 'Email is already registered'
        });
      }

      // Handle database constraint violations
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new RpcException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email is already registered'
        });
      }

      // Log unexpected errors for debugging
      // console.error('Unexpected error in createUser:', error);

      // Generic fallback for unexpected errors
      throw new RpcException({
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred while creating user'
      });
    }
  }

  @EventPattern('payment-created-event-to-user')
  paymentCreated(@Payload() data: any) {
    console.log('User notified that Payment created', data);
    return data;
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: number) {
    return this.usersService.findById(id);
  }
}

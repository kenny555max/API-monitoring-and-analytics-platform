import {Body, Controller, Inject, Post} from '@nestjs/common';
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user-dto";
import {Observable, timeout, retry, catchError, map, throwError} from 'rxjs';
import {
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException
} from '../libs/common/exceptions/auth';
import { ErrorCode } from "../libs/common/enums";

@Controller('users')
export class UsersController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // With NATS and microservices, you can't use traditional try/catch because this.natsClient.send() ' +
  // 'returns an Observable, not a Promise that throws exceptions.
  @Post('/create-user')
  create(@Body() createUserDto: CreateUserDto): Observable<any> {
    return this.natsClient.send('createUser', createUserDto).pipe(
        timeout(3000), // Timeout if response takes longer than 3 seconds
        retry(2),      // Retry up to 2 times on failure
        map((user) => ({
          status: 'success',
          data: user,
        })),
        // What is RpcException?
        // --RpcException is a NestJS microservices-specific exception class used for communication
        // --between microservices. It's designed to properly serialize and transport errors across
        // --service boundaries (like NATS, Redis, RabbitMQ, etc.).

        // Why Check for RpcException Instance?
        // When communicating between microservices, you can receive different types of errors:
        // 1. RpcException (from your microservice)
        // 2. Network/Transport Errors
        // 3. Unexpected Errors

        catchError(error => {
          // Handle RpcExceptions from microservice
          console.log('before crisis', error);
          if (error.code && error.message) {
            if (typeof error === 'object' && 'code' in error) {
              switch (error.code) {
                case 'USER_NOT_FOUND':
                case 'INVALID_PASSWORD':
                  return throwError(() => new UnauthorizedException(error.message || 'Invalid Credentials'));
                case 'ACCOUNT_LOCKED':
                  return throwError(() => new ForbiddenException(error.message || 'Account Is Locked'));
                case 'EMAIL_ALREADY_EXISTS':
                case 'RESOURCE_ALREADY_EXISTS':
                  return throwError(() => new BadRequestException(ErrorCode.RESOURCE_ALREADY_EXISTS, error.message || 'Email already exists'));
                default:
                  return throwError(() => new InternalServerErrorException('Operation failed'));
              }
            }
          }

          // Fallback for unexpected errors
          return throwError(() => new InternalServerErrorException('An unexpected error occurred'));
        })
    );
  }

  @Post('/login')
  login(@Body() payload: { email: string; password: string }) {
    return this.natsClient.send('login', payload).pipe(
      timeout(3000),
      retry(2),
      map((user) => ({
        status: 'success',
        data: user,
      })),
      // What is RpcException?
      // --RpcException is a NestJS microservices-specific exception class used for communication
      // --between microservices. It's designed to properly serialize and transport errors across
      // --service boundaries (like NATS, Redis, RabbitMQ, etc.).

      // Why Check for RpcException Instance?
      // When communicating between microservices, you can receive different types of errors:
      // 1. RpcException (from your microservice)
      // 2. Network/Transport Errors
      // 3. Unexpected Errors

      catchError(error => {
        // Handle RpcExceptions from microservice
        console.log('before crisis', error);
        if (error.code && error.message) {
          if (typeof error === 'object' && 'code' in error) {
            switch (error.code) {
              case 'USER_NOT_FOUND':
              case 'INVALID_PASSWORD':
                return throwError(() => new UnauthorizedException(error.message || 'Invalid Credentials'));
              case 'ACCOUNT_LOCKED':
                return throwError(() => new ForbiddenException(error.message || 'Account Is Locked'));
              default:
                return throwError(() => new InternalServerErrorException('Operation failed'));
            }
          }
        }

        // Fallback for unexpected errors
        return throwError(() => new InternalServerErrorException('An unexpected error occurred'));
      })
    )
  }
}

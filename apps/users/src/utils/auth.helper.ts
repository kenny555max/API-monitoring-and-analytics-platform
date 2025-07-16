import {ValidationException} from "../libs/common/exceptions/validation";
import {Injectable} from '@nestjs/common';
import {InjectRedis} from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class UsersService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async checkOtpRestrictions(
        email: string,
    ) {
        if (await this.redis.get(`otp_lock:${email}`)){
            return new ValidationException(
                "Account locked due to multiple failed attempts!. Try again after 30 minutes."
            )
        }
        if (await this.redis.get(`otp_spam_lock:${email}`)){
            return new ValidationException(
                "Too many requests. Please wait 1hour before trying again."
            )
        }
        if (await this.redis.get(`otp_cooldown:${email}`)){
            return new ValidationException(
                "Please wait 1minute before requesting a new OTP!"
            )
        }
    }
}

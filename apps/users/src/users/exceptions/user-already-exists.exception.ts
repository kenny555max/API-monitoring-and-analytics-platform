import {BaseCustomException} from "../../libs/common/exceptions/base/";
import { ErrorCode } from '../../libs/common/enums';
import {ErrorDetails} from "../../libs/common/interfaces";

export class UserAlreadyExistsException extends BaseCustomException {
    readonly statusCode = 409;
    readonly errorCode = ErrorCode.RESOURCE_ALREADY_EXISTS;

    constructor(
        identifier: string,
        field: 'email' | 'username' | 'phone' = 'email',
        additionalContext?: Record<string, any>
    ) {
        const message = `User with ${field} '${identifier}' already exists`;

        const details: ErrorDetails[] = [{
            field,
            value: identifier,
            constraint: 'unique',
            context: {
                message: `A user with this ${field} is already registered`,
                conflictField: field,
                conflictValue: identifier,
                suggestion: field === 'email'
                    ? 'Try logging in or use password reset if you forgot your password'
                    : `Choose a different ${field}`
            }
        }];

        super(message, details, additionalContext);
    }

    // Static factory methods for different conflict types
    static withEmail(email: string, userId?: number): UserAlreadyExistsException {
        return new UserAlreadyExistsException(email, 'email', userId ? { conflictingUserId: userId } : undefined);
    }

    static withUsername(username: string, userId?: number): UserAlreadyExistsException {
        return new UserAlreadyExistsException(username, 'username', userId ? { conflictingUserId: userId } : undefined);
    }

    static withPhone(phone: string, userId?: number): UserAlreadyExistsException {
        return new UserAlreadyExistsException(phone, 'phone', userId ? { conflictingUserId: userId } : undefined);
    }
}
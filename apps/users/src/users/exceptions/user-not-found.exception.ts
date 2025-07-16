import {BaseCustomException} from "../../libs/common/exceptions/base";
import { ErrorCode } from '../../libs/common/enums';
import {ErrorDetails} from "../../libs/common/interfaces";

export class UserNotFoundException extends BaseCustomException {
    readonly statusCode = 404;
    readonly errorCode = ErrorCode.RESOURCE_NOT_FOUND;

    constructor(identifier: string | number, searchBy: 'id' | 'email' | 'username' = 'id') {
        const message = `User with ${searchBy} '${identifier}' not found`;

        const details: ErrorDetails[] = [{
            field: searchBy,
            value: identifier,
            constraint: 'exists',
            context: {
                message: `No user found with the provided ${searchBy}`,
                searchCriteria: searchBy,
                searchValue: identifier
            }
        }];

        super(message, details);
    }

    // Static factory methods for different search types
    static byId(id: number): UserNotFoundException {
        return new UserNotFoundException(id, 'id');
    }

    static byEmail(email: string): UserNotFoundException {
        return new UserNotFoundException(email, 'email');
    }

    static byUsername(username: string): UserNotFoundException {
        return new UserNotFoundException(username, 'username');
    }
}
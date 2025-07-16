import {BaseCustomException} from "../base/base-custom.exception";
import {ErrorCode} from "../../enums/errorCode";

export class UnauthorizedException extends BaseCustomException {
    readonly statusCode = 401;
    readonly errorCode = ErrorCode.UNAUTHORIZED;

    constructor(message: string = 'Unauthorized access') {
        super(message);
    }
}
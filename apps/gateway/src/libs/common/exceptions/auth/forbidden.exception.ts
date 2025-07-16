import {BaseCustomException} from "../base";
import {ErrorCode} from "../../enums";

export class ForbiddenException extends BaseCustomException {
    readonly statusCode = 403;
    readonly errorCode = ErrorCode.FORBIDDEN;

    constructor(message: string = 'Access forbidden') {
        super(message);
    }
}
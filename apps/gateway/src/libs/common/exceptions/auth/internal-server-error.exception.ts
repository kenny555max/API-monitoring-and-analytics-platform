import {BaseCustomException} from "../base";
import {ErrorCode} from "../../enums";

export class InternalServerErrorException extends BaseCustomException {
    readonly statusCode = 500;
    readonly errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

    constructor(message: string = 'Access forbidden') {
        super(message);
    }
}
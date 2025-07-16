import {BaseCustomException} from "../base/base-custom.exception";
import {ErrorCode} from "../../enums/errorCode";
import {ErrorDetails} from "../../interfaces/errorInterfaces";

export class ValidationException extends BaseCustomException {
    readonly statusCode = 400;
    readonly errorCode = ErrorCode.VALIDATION_ERROR;

    constructor(message: string = 'Validation failed', details?: ErrorDetails[]) {
        super(message, details);
    }
}
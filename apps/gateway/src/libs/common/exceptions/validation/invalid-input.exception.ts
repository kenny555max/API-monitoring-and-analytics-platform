import {BaseCustomException} from "../base/base-custom.exception";
import {ErrorCode} from "../../enums/errorCode";
import {ErrorDetails} from "../../interfaces/errorInterfaces";

export class InvalidInputException extends BaseCustomException {
    readonly statusCode = 400;
    readonly errorCode = ErrorCode.INVALID_INPUT;

    constructor(message: string = 'Invalid Input', details?: ErrorDetails[]) {
        super(message, details);
    }
}
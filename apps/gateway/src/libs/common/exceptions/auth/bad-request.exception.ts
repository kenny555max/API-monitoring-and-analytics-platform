import { BaseCustomException } from "../base";
import { ErrorCode } from "../../enums";

export class BadRequestException extends BaseCustomException {
    readonly statusCode = 400;
    readonly errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, message?: string) {
        super(message || BadRequestException.getDefaultMessage(errorCode));
        this.errorCode = errorCode;
    }

    private static getDefaultMessage(errorCode: ErrorCode): string {
        const messages = {
            [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Business rule violation',
            [ErrorCode.INVALID_INPUT]: 'Invalid input provided',
            [ErrorCode.VALIDATION_FAILED]: 'Validation failed',
            // Add more as needed
        };
        return messages[errorCode] || 'Bad request';
    }
}
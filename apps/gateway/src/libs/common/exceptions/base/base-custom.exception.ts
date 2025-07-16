import {ErrorDetails} from "../../interfaces";
import { ErrorCode } from '../../enums';

export abstract class BaseCustomException extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: ErrorCode;
    public readonly details?: ErrorDetails[];
    public readonly context?: Record<string, any>;

    constructor(
        message: string,
        details?: ErrorDetails[],
        context?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
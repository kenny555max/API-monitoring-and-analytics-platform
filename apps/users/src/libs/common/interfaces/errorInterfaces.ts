import { ErrorCode } from '../enums/errorCode';

export interface ErrorDetails {
    field?: string;
    value?: any;
    constraint?: string;
    context?: Record<string, any>;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
        details?: ErrorDetails[];
        timestamp: string;
        path: string;
        requestId: string;
        stack?: string;
    };
}
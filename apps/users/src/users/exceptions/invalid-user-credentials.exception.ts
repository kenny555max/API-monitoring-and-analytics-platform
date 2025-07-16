import {BaseCustomException} from "../../libs/common/exceptions/base";
import { ErrorCode } from '../../libs/common/enums';
import {ErrorDetails} from "../../libs/common/interfaces";

export class InvalidUserCredentialsException extends BaseCustomException {
    readonly statusCode = 401;
    readonly errorCode = ErrorCode.UNAUTHORIZED;

    constructor(
        loginField: string = 'email',
        reason: 'invalid_password' | 'user_not_found' | 'account_locked' | 'account_disabled' = 'invalid_password',
        additionalInfo?: Record<string, any>
    ) {
        const messages = {
            invalid_password: 'Invalid credentials provided',
            user_not_found: 'Invalid credentials provided', // Same message for security
            account_locked: 'Account is temporarily locked due to multiple failed login attempts',
            account_disabled: 'Account has been disabled. Please contact support'
        };

        const message = messages[reason];

        const details: ErrorDetails[] = [{
            field: 'credentials',
            constraint: 'valid',
            context: {
                message,
                loginField,
                reason,
                securityNote: reason === 'invalid_password' || reason === 'user_not_found'
                    ? 'For security reasons, we don\'t specify whether the email or password is incorrect'
                    : undefined,
                ...additionalInfo
            }
        }];

        super(message, details, {
            loginAttempt: true,
            loginField,
            reason,
            timestamp: new Date().toISOString(),
            ...additionalInfo
        });
    }

    // Static factory methods for different credential issues
    static invalidPassword(loginField: string = 'email', attemptCount?: number): InvalidUserCredentialsException {
        return new InvalidUserCredentialsException(
            loginField,
            'invalid_password',
            attemptCount ? { failedAttempts: attemptCount } : undefined
        );
    }

    static userNotFound(loginField: string = 'email'): InvalidUserCredentialsException {
        return new InvalidUserCredentialsException(loginField, 'user_not_found');
    }

    static accountLocked(loginField: string, lockoutExpiry?: Date, attemptCount?: number): InvalidUserCredentialsException {
        return new InvalidUserCredentialsException(loginField, 'account_locked', {
            lockoutExpiry: lockoutExpiry?.toISOString(),
            failedAttempts: attemptCount,
            lockoutDurationMinutes: lockoutExpiry
                ? Math.ceil((lockoutExpiry.getTime() - Date.now()) / (1000 * 60))
                : undefined
        });
    }

    static accountDisabled(loginField: string, disabledReason?: string): InvalidUserCredentialsException {
        return new InvalidUserCredentialsException(loginField, 'account_disabled', {
            disabledReason,
            contactSupport: true
        });
    }
}

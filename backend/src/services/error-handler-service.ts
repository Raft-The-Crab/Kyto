import { logger, LogLevel } from "./logger-service";

// Define error categories for better organization
export enum ErrorCategory {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  DATABASE = "database",
  NETWORK = "network",
  BUSINESS_LOGIC = "business_logic",
  EXTERNAL_SERVICE = "external_service",
  SYSTEM = "system",
}

// Custom Kyto error class that extends standard Error
export class KytoError extends Error {
  public readonly category: ErrorCategory;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: number;
  public readonly correlationId: string;

  constructor(
    message: string,
    category: ErrorCategory,
    code: string,
    details?: Record<string, unknown>,
    options?: ErrorOptions
  ) {
    super(message);
    this.name = "KytoError";
    this.category = category;
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
    this.correlationId = this.generateCorrelationId();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KytoError);
    }
  }

  private generateCorrelationId(): string {
    // Generate a unique identifier for tracking this error across systems
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convert to serializable object for logging/network transmission
  toObject(): {
    message: string;
    category: ErrorCategory;
    code: string;
    details?: Record<string, unknown>;
    timestamp: number;
    correlationId: string;
    stack?: string;
  } {
    return {
      message: this.message,
      category: this.category,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      stack: this.stack,
    };
  }
}

// Error handler interface
export interface ErrorHandler {
  handle(error: Error, context?: Record<string, unknown>): void;
  shouldLog(error: Error): boolean;
  formatError(error: Error): string;
}

// Main error handler implementation
export class ErrorHandlerService implements ErrorHandler {
  private static instance: ErrorHandlerService;
  private errorHandlers: Map<ErrorCategory, (error: KytoError) => void> =
    new Map();

  private constructor() {
    // Register default error handlers
    this.registerDefaultHandlers();
  }

  static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  // Register a custom handler for a specific error category
  registerHandler(
    category: ErrorCategory,
    handler: (error: KytoError) => void
  ): void {
    this.errorHandlers.set(category, handler);
  }

  // Handle an error with appropriate category-specific logic
  handle(error: Error, context: Record<string, unknown> = {}): void {
    let kytoError: KytoError;

    // Convert to KytoError if it's not already
    if (!(error instanceof KytoError)) {
      kytoError = this.convertToKytoError(error, context);
    } else {
      kytoError = error;
    }

    // Log the error
    this.logError(kytoError, context);

    // Execute category-specific handler if registered
    const handler = this.errorHandlers.get(kytoError.category);
    if (handler) {
      try {
        handler(kytoError);
      } catch (handlerError) {
        // If the error handler itself fails, log it but don't throw
        logger.error("Error handler failed", {
          originalError: kytoError.toObject(),
          handlerError: handlerError.message,
        });
      }
    }

    // Potentially send to external error tracking service
    this.sendToExternalTracker(kytoError, context);
  }

  // Determine if an error should be logged
  shouldLog(error: Error): boolean {
    // Don't log certain expected errors
    if (error instanceof KytoError) {
      // For now, log all errors - in production you might want to filter some
      return true;
    }
    // Log all errors that aren't KytoError instances as well
    return true;
  }

  // Format error for display or logging
  formatError(error: Error): string {
    if (error instanceof KytoError) {
      return `[${error.category}] ${error.code}: ${error.message} (correlationId: ${error.correlationId})`;
    }
    return `Unexpected Error: ${error.message}`;
  }

  // Convert a standard Error to KytoError
  private convertToKytoError(
    error: Error,
    context: Record<string, unknown>
  ): KytoError {
    // Try to determine the appropriate category based on the error
    let category = ErrorCategory.SYSTEM; // Default category

    if (
      error.message.includes("validation") ||
      error.message.includes("Validation")
    ) {
      category = ErrorCategory.VALIDATION;
    } else if (
      error.message.includes("auth") ||
      error.message.includes("Auth")
    ) {
      category = error.name.includes("Authentication")
        ? ErrorCategory.AUTHENTICATION
        : ErrorCategory.AUTHORIZATION;
    } else if (
      error.message.toLowerCase().includes("database") ||
      error.message.toLowerCase().includes("db")
    ) {
      category = ErrorCategory.DATABASE;
    } else if (
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("fetch")
    ) {
      category = ErrorCategory.NETWORK;
    }

    return new KytoError(
      error.message,
      category,
      `ERR_${category.toString().toUpperCase()}_${Date.now()}`,
      {
        originalName: error.name,
        originalMessage: error.message,
        context,
        ...(error.stack && { stack: error.stack }),
      }
    );
  }

  // Log the error using our logger service
  private logError(error: KytoError, context: Record<string, unknown>): void {
    const logLevel = this.getErrorLogLevel(error.category);

    logger[logLevel](error.message, {
      ...context,
      category: error.category,
      code: error.code,
      correlationId: error.correlationId,
      details: error.details,
    });
  }

  // Determine log level based on error category
  private getErrorLogLevel(category: ErrorCategory): LogLevel {
    switch (category) {
      case ErrorCategory.VALIDATION:
        return LogLevel.INFO; // Validation errors might be expected
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.AUTHORIZATION:
        return LogLevel.WARN; // Security-related errors
      case ErrorCategory.DATABASE:
      case ErrorCategory.NETWORK:
        return LogLevel.ERROR; // Infrastructure errors
      case ErrorCategory.BUSINESS_LOGIC:
        return LogLevel.WARN; // Business rule violations
      case ErrorCategory.EXTERNAL_SERVICE:
        return LogLevel.WARN; // External service issues
      case ErrorCategory.SYSTEM:
      default:
        return LogLevel.ERROR; // Unexpected system errors
    }
  }

  // Send error to external tracking service (placeholder)
  private sendToExternalTracker(
    error: KytoError,
    context: Record<string, unknown>
  ): void {
    // In a real implementation, this would send errors to services like Sentry, Bugsnag, etc.
    // For now, we'll just log a message
    logger.debug("Would send error to external tracker", {
      correlationId: error.correlationId,
      category: error.category,
      code: error.code,
    });
  }

  // Register default handlers for common error categories
  private registerDefaultHandlers(): void {
    // Database errors - might trigger alerts or fallback mechanisms
    this.errorHandlers.set(ErrorCategory.DATABASE, (error) => {
      logger.error("Database error occurred", {
        correlationId: error.correlationId,
        details: error.details,
      });
      // Could implement retry logic, fallback to cache, etc.
    });

    // Network errors - might trigger retry or offline mode
    this.errorHandlers.set(ErrorCategory.NETWORK, (error) => {
      logger.warn("Network error occurred", {
        correlationId: error.correlationId,
        details: error.details,
      });
      // Could implement retry logic or switch to offline mode
    });

    // Authentication errors - might trigger session cleanup
    this.errorHandlers.set(ErrorCategory.AUTHENTICATION, (error) => {
      logger.info("Authentication error occurred", {
        correlationId: error.correlationId,
        details: error.details,
      });
      // Could trigger session cleanup or re-authentication
    });

    // Authorization errors - might trigger permission checks
    this.errorHandlers.set(ErrorCategory.AUTHORIZATION, (error) => {
      logger.warn("Authorization error occurred", {
        correlationId: error.correlationId,
        details: error.details,
      });
      // Could trigger permission review or admin notification
    });
  }

  // Get recent errors for monitoring
  getRecentErrors(limit: number = 10): KytoError[] {
    // In a real implementation, this would return errors from a persistent store
    // For now, we'll just return an empty array
    return [];
  }
}

// Error boundary for async operations
export class AsyncErrorBoundary {
  static async execute<T>(
    operation: () => Promise<T>,
    context: Record<string, unknown> = {},
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const errorHandler = ErrorHandlerService.getInstance();
      errorHandler.handle(error, { ...context, operation: operation.name });

      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          errorHandler.handle(fallbackError, {
            ...context,
            operation: operation.name,
            fallbackAttempt: true,
          });
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }
}

// Convenience function for quick error handling
export const handleError = (
  error: Error,
  context: Record<string, unknown> = {}
) => {
  const errorHandler = ErrorHandlerService.getInstance();
  errorHandler.handle(error, context);
};

// Export the error handler instance
export const errorHandler = ErrorHandlerService.getInstance();

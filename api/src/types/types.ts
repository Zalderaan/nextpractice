export type AppError = Error & {
    statusCode?: number;
    status?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
    isOperational?: boolean;
}
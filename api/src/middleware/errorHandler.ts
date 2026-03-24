import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/types";

export const makeAppError = (message: string, statusCode: number): AppError => {
    const err = new Error(message) as AppError;
    err.statusCode = statusCode;
    err.isOperational = true;
    return err;
};

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: "Validation failed",
            details: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
        return;
    }

    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            error: "Database validation error",
            details: err.message
        });
        return;
    }

    if (err.name === "CastError") {
        res.status(400).json({
            success: false,
            error: "Invalid data format"
        });
        return;
    }

    if (err.code === 11000 && err.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        res.status(409).json({
            success: false,
            error: `${field} already exists`
        });
        return;
    }

    const statusCode = err.statusCode ?? err.status ?? 500;
    res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? "Internal server error" : err.message
    });
};
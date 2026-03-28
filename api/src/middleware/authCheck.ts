import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utls/jwt';
import { makeAppError } from './errorHandler';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const allHeaders = req.headers;
    console.log("All headers: ", allHeaders);
    const authHeader = req.headers.authorization;
    console.log("This is authHeader: ", authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(makeAppError('Access token missing', 401));
    }

    const token = authHeader.split(' ')[1];
    // console.log("This is token: ", token);
    try {
        const decoded = verifyAccessToken(token);
        // ! NOT TYPE SAFE
        (req as any).user = decoded;  // Attach user to req for use in controllers
        next();
    } catch (error) {
        return next(makeAppError('Invalid or expired token', 401));
    }
};
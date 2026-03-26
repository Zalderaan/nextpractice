import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utls/jwt';
import { makeAppError } from './errorHandler';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(makeAppError('Access token missing', 401));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;  // Attach user to req for use in controllers
        next();
    } catch (error) {
        return next(makeAppError('Invalid or expired token', 401));
    }
};
import 'dotenv/config';
import { UserService } from "./user.service"
import { Response, Request, NextFunction, type CookieOptions } from "express"
import { LoginInput, RegisterInput } from "./user.validator";
import { AppError } from "../../types/types";
import { verifyRefreshToken } from '../../utls/jwt';
import { makeAppError } from '../../middleware/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === "production";
console.log("from user.controller, this is isProduction: ", isProduction);
const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days (in milliseconds)

const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: refreshTokenMaxAgeMs,
    path: "/"
};

export class UserController {
    // POST
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.createUser(req.body as RegisterInput);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const auth = await UserService.authenticateUser(req.body as LoginInput); // req.body is already validated by validate middleware
            // auth = { user, accessToken, refreshToken }

            // store refreshToken in cookie with refreshCookieOptions for security
            res.cookie("refreshToken", auth.refreshToken, refreshCookieOptions);

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: auth.user,
                    accessToken: auth.accessToken
                }
            });
        } catch (error) {
            // map auth failures to 401 before forwarding
            const err = (error instanceof Error ? error : new Error("Invalid email or password")) as AppError;
            if (err.message.toLowerCase().includes("invalid email or password")) {
                err.statusCode = 401;
                err.message = "Invalid email or password";
            }
            next(err);
        }
    }

    static async refreshTokens(req: Request, res: Response, next: NextFunction) {
        try {
            // read cookie 
            const refresh_cookie = req.cookies?.refreshToken;

            // no cookie, return 401
            if (!refresh_cookie) {
                return next(makeAppError("Refresh token missing", 401));
            }

            // verify refresh token from cookie
            const decoded: JwtPayload & { sub: string } = verifyRefreshToken(refresh_cookie);

            // find user
            const user = await UserService.getUserById(decoded.sub);

            // issue new access token
            const tokens = await UserService.refreshTokens(user);

            // refreshToken in cookies, attach accessToken to response
            res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);
            res.status(200).json({
                success: true,
                message: "Tokens refreshed successfully",
                data: {
                    user: user,
                    accessToken: tokens.accessToken
                }
            })

        } catch (error) {
            next(error);
        } finally {
            // clean up
        }
    }

    // GET
}
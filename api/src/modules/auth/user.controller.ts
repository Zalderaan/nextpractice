import 'dotenv/config';
import { UserService } from "./user.service"
import { Response, Request, NextFunction, type CookieOptions } from "express"
import { LoginInput, RegisterInput } from "./user.validator";
import { AppError } from "../../types/types";

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

    // GET
}
import { UserService } from "../services/user.service";
import { Response, Request, NextFunction } from "express"
import { LoginInput, loginSchema, RegisterInput, registerSchema } from "../validators/user.validator";
import { AppError } from "../types/types";


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
            // req.body is already validated by validate middleware
            const user = await UserService.authenticateUser(req.body as LoginInput);

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: user
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
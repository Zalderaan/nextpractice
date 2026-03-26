import argon2 from "argon2";
import User, { IUser } from "./User.model";
import { LoginInput, RegisterInput } from "./user.validator";
import { makeAppError } from "../../middleware/errorHandler";
import { signAccessToken, signRefreshToken, type TokenPayload } from "../../utls/jwt";

type AuthServiceResponse = {
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
}

type RefreshTokensResponse = {
    refreshToken: string;
    accessToken: string;
}

type SafeUser = {
    _id: string,
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;  // Add this to match Mongoose timestamps
}

export class UserService {
    // post
    static async createUser(userData: RegisterInput): Promise<SafeUser> {
        const hashedPassword = await argon2.hash(userData.password);
        const newUser = await new User({ ...userData, password: hashedPassword });
        const savedUser = await newUser.save();

        // Exclude password (and any other sensitive fields) for security
        const { password: _, ...safeUser } = savedUser.toObject();
        return safeUser as unknown as SafeUser;
    }

    static async authenticateUser({ email, password }: LoginInput): Promise<AuthServiceResponse> {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // include password just this once
        if (!user) throw makeAppError("Invalid email or password", 401)

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) throw makeAppError("Invalid email or password", 401)

        // * user is now typed
        const payload: TokenPayload = {
            email: user.email,
            role: user.role,
            sub: user._id.toString()
        }

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken({ sub: payload.sub })
        const { password: _, ...safeUser } = user.toObject();

        return {
            user: safeUser as unknown as SafeUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    static async refreshTokens(user: SafeUser): Promise<RefreshTokensResponse> {
        const payload: TokenPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        }

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken({ sub: payload.sub })

        return {
            accessToken,
            refreshToken
        }
    }

    // read
    static async getUsers() {
        const users = await User.find([]);
        return users;
    }

    static async getUserById(id: string): Promise<SafeUser> {
        const user = await User.findById({ _id: id });

        // user not found, but return 401 since it's auth
        if (!user) throw makeAppError("Invalid user credentials", 401)
        const { password: _, ...safeUser } = user.toObject();
        return safeUser as unknown as SafeUser
    }

    // update

    // delete
    static async deleteUser() {

    }

}
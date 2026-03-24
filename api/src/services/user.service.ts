import argon2 from "argon2";
import User, { IUser } from "../models/User.model";
import { LoginInput, RegisterInput } from "../validators/user.validator";
import { makeAppError } from "../middleware/errorHandler";

export class UserService {
    // post
    static async createUser(userData: RegisterInput): Promise<IUser> {
        const hashedPassword = await argon2.hash(userData.password);
        const newUser = await new User({ ...userData, password: hashedPassword });
        return await newUser.save();
    }

    static async authenticateUser({ email, password }: LoginInput) {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // include password just this once
        if (!user) throw makeAppError("Invalid email or password", 401)

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) throw makeAppError("Invalid email or password", 401)

        // Return user (exclude password for security)
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    // read
    static async getUsers() {
        try {
            const users = await User.find([]);
            return users;
        } catch (error) {
            throw new Error(`Error fetching users: ${error as Error}`).message;
        }
    }

    static async getUserById() {
        try {
            const user = await User.find([])
        } catch (error) {
            throw new Error(`Error fetching user by id: ${error as Error}.message`)
        }
    }

    // update

    // delete
    static async deleteUser() {

    }

}
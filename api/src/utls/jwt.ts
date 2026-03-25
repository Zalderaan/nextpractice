import 'dotenv/config'
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { makeAppError } from "../middleware/errorHandler";

export type TokenPayload = {
    sub: string; // user id
    email: string;
    role: "user" | "admin";
};

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw makeAppError(`${key} is not set`, 500);
    return value;
};

const ACCESS_TOKEN_SECRET: Secret = getEnv("ACCESS_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET: Secret = getEnv("REFRESH_TOKEN_SECRET");

const ACCESS_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] =
    (process.env.ACCESS_TOKEN_EXPIRES_IN || "15m") as SignOptions["expiresIn"];

const REFRESH_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] =
    (process.env.REFRESH_TOKEN_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export const signAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
};

export const signRefreshToken = (payload: Pick<TokenPayload, "sub">): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch {
        throw makeAppError("Invalid or expired access token", 401);
    }
};

export const verifyRefreshToken = (
    token: string
): JwtPayload & { sub: string } => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload & { sub: string };
    } catch {
        throw makeAppError("Invalid or expired refresh token", 401);
    }
};
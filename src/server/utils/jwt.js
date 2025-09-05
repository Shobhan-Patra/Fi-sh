import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)};

export function generateRefreshToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)};

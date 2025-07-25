import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });

    return token;
};

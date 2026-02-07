import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).send({ message: "Unauthorized: No token provided" });
        return;
    }

    const token = authorization.split("Bearer ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken; // Attach user to request
        next(); // Pass control to the next function
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).send({ message: "Unauthorized: Invalid token" });
        return;
    }
};
import type { NextFunction, Request, Response } from "express";

export const validateMiddleware = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            return next();
        } catch (error) {
            res.status(400).json({
                message: "Validation failed",
                error: error,
                success: false
            });
        }
    }
}
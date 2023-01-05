import { Response } from "express";

export const successResponse = ({ status, result, res, meta = {}, message = '' }: { status: number, result: any, res: Response, meta?: any, message?: string }) => {
    return res.status(status).json({
        data: result,
        meta: meta,
        success: true,
        message: message,
    });
}
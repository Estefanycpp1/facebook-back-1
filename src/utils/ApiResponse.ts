import { Response as ExpressResponse } from "express";

export default class ApiResponse {

    constructor() {}

    static success(res: ExpressResponse, message: string, data?: any) {
        return res.status(200).json({ success: true, message, data });
    }

    static error(res: ExpressResponse, message: string, statusCode = 400) {
        return res.status(statusCode).json({ success: false, message });
    }

    static notFound(res: ExpressResponse, message: string) {
        return this.error(res, message, 404);
    }

    static unauthorized(res: ExpressResponse, message: string) {
        return this.error(res, message, 401);
    }

    static serverError(res: ExpressResponse, message: string) {
        return this.error(res, message, 500);
    }
}

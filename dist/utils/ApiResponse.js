export default class ApiResponse {
    constructor() { }
    static success(res, message, data) {
        return res.status(200).json({ success: true, message, data });
    }
    static error(res, message, statusCode = 400) {
        return res.status(statusCode).json({ success: false, message });
    }
    static notFound(res, message) {
        return this.error(res, message, 404);
    }
    static unauthorized(res, message) {
        return this.error(res, message, 401);
    }
    static serverError(res, message) {
        return this.error(res, message, 500);
    }
}

import jwt from "jsonwebtoken";
import "dotenv/config";
export default function attachUserId(req, _, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.body.idUserToken = decoded.id;
            next();
        }
        catch (error) {
            console.error(error);
            next();
        }
    }
    else {
        next();
    }
}

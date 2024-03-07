import { Request, Response, NextFunction } from "express";
import { AnyObjectSchema} from "yup";

export default function validationYup(schema: AnyObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body);
            next();
        } catch (error) {
            res.status(400).json({ message: error});
        }
    }
}
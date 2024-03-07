import jwt from "jsonwebtoken";
import { Request } from "express";
import "dotenv/config";

export default function attachUserId(req: Request, _: any, next: any): void {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
   
      req.body.idUserToken = decoded.id;
      next();
    } catch (error) {
      console.error(error);
      next();
    }
  } else {
    next();
  }
}
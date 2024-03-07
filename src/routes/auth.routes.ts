import {Router} from 'express'
import authController from '../controllers/auth.controller.js'
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';

let authRouter = Router();

authRouter.post("/register",validationYup(schemas.registerSchema),authController.register);
authRouter.post("/login",validationYup(schemas.loginSchema),authController.login);

export default authRouter;

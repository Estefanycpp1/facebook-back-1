import UserCollection, { IUser } from "../models/user.js";
import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";

export default class authController {
    static login = async (req: Request, res: Response) => {
        const { identifier, password } = req.body;

        // Verifica si el identificador es un correo electrónico o un nombre de usuario
        const isEmail = identifier.includes('@');

        // Busca el usuario por correo electrónico o nombre de usuario
        const user = isEmail
            ? await UserCollection.findOne({ email: identifier })
            : await UserCollection.findOne({ username: identifier });

        if (!user) {
            return ApiResponse.error(res, "User does not exist");
        }

        if(user.isDisabled){
            return ApiResponse.error(res, "User is disabled");
        }
        
        // Verifica la contraseña
        const validPassword = await user.comparePassword(password);

        if (!validPassword) {
            return ApiResponse.error(res, "Invalid password");
        }

        // Genera el token de autenticación
        const token = await user.createToken(user);

        let flag = false;
        if(user.firstLogin){
            flag = true;
            user.firstLogin = false;
            await user.save();
        }
        return ApiResponse.success(res, "User logged in", { token, firstLogin: flag });
    };

    static register = async (req: Request, res: Response) => {
        const { email, username, password, fullName } = req.body;

        // Verifica si ya existe un usuario con el mismo correo electrónico o nombre de usuario
        const emailExists = await UserCollection.findOne({ email });
        const usernameExists = await UserCollection.findOne({ username });

        if (emailExists) {
            return ApiResponse.error(res, "User with email already exists");
        }

        if (usernameExists) {
            return ApiResponse.error(res, "User with username already exists");
        }

        // Crea un nuevo usuario si no hay coincidencias con el correo electrónico o nombre de usuario
        const user = new UserCollection({
            email,
            username,
            password,
            fullName
        });

        await user.save();
        return ApiResponse.success(res, `User ${user.username} created`, null);
    };
}

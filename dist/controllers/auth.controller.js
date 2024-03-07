var _a;
import UserCollection from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
class authController {
}
_a = authController;
authController.login = async (req, res) => {
    const { identifier, password } = req.body;
    const isEmail = identifier.includes('@');
    const user = isEmail
        ? await UserCollection.findOne({ email: identifier })
        : await UserCollection.findOne({ username: identifier });
    if (!user) {
        return ApiResponse.error(res, "User does not exist");
    }
    if (user.isDisabled) {
        return ApiResponse.error(res, "User is disabled");
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
        return ApiResponse.error(res, "Invalid password");
    }
    const token = await user.createToken(user);
    let flag = false;
    if (user.firstLogin) {
        flag = true;
        user.firstLogin = false;
        await user.save();
    }
    return ApiResponse.success(res, "User logged in", { token, firstLogin: flag });
};
authController.register = async (req, res) => {
    const { email, username, password, fullName } = req.body;
    const emailExists = await UserCollection.findOne({ email });
    const usernameExists = await UserCollection.findOne({ username });
    if (emailExists) {
        return ApiResponse.error(res, "User with email already exists");
    }
    if (usernameExists) {
        return ApiResponse.error(res, "User with username already exists");
    }
    const user = new UserCollection({
        email,
        username,
        password,
        fullName
    });
    await user.save();
    return ApiResponse.success(res, `User ${user.username} created`, null);
};
export default authController;

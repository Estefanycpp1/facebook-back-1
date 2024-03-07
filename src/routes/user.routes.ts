import {Router} from 'express'
import UserController from '../controllers/user.controller.js';
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';
let userRouter = Router();

import passport from 'passport';
import attachUserId from '../middlewares/attachUserId.js';
import validateUserIdToken from '../middlewares/validateUserId.js';

userRouter.use(passport.authenticate("jwt", { session: false }));


userRouter.put(
    "/",
    attachUserId,
    validateUserIdToken,
    validationYup(schemas.updateUserDataSchema),
    UserController.updateUserData
);

userRouter.delete(
    "/:userId",
    attachUserId,
    validateUserIdToken,
    UserController.deleteUser
);

userRouter.get(
    "/search/:userId/:query",
    UserController.searchUser
);

userRouter.get(
    "/profile/:userId",
   
    UserController.getProfileData
);

userRouter.get("/data/allUsers/:userId", UserController.getAllUsers);


export default userRouter;
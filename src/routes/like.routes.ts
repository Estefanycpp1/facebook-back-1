import {Router} from 'express'
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';
import LikeController from '../controllers/like.controller.js';

import passport from 'passport';
import attachUserId from '../middlewares/attachUserId.js';
import validateUserIdToken from '../middlewares/validateUserId.js';


let likeRouter = Router();


likeRouter.use(passport.authenticate("jwt", { session: false }));
likeRouter.use(attachUserId);
likeRouter.use(validateUserIdToken);

likeRouter.post("/like",validationYup(schemas.likeSchema),LikeController.likeEco);

likeRouter.post("/dislike",validationYup(schemas.likeSchema),LikeController.dislikeEco);

export default likeRouter;

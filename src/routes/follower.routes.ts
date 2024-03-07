import {Router} from 'express'
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';
import followerController from '../controllers/follower.controller.js';

import passport from 'passport';
import attachUserId from '../middlewares/attachUserId.js';
import validateUserIdToken from '../middlewares/validateUserId.js';

let followerRouter = Router();

followerRouter.use(passport.authenticate("jwt", { session: false }));
followerRouter.use(attachUserId);
followerRouter.use(validateUserIdToken);

followerRouter.post("/follow",validationYup(schemas.followSchema),followerController.followUser);

followerRouter.post("/unfollow",validationYup(schemas.followSchema),followerController.unfollowUser);


export default followerRouter;
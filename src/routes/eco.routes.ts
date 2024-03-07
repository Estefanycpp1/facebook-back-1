import {Router} from 'express'
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';
import EcoController from '../controllers/eco.controller.js';

import passport from 'passport';
import attachUserId from '../middlewares/attachUserId.js';
import validateUserIdToken from '../middlewares/validateUserId.js';

let ecoRouter = Router();
ecoRouter.use(passport.authenticate("jwt", { session: false }));

ecoRouter.post("/",validationYup(schemas.createEcoSchema),EcoController.createEco);

ecoRouter.delete("/:ecoId/:userId",attachUserId ,validateUserIdToken ,EcoController.deleteEco);

ecoRouter.post("/reply",validationYup(schemas.replySchema),EcoController.replyEco);
// ecoRouter.put("/",validationYup(schemas.updateEcoSchema),EcoController.updateEcoData);

ecoRouter.get("/:ecoId",EcoController.getEcoById);
ecoRouter.get("/allecos/:userId",EcoController.getAllEcos);
ecoRouter.get('/eco/userEcos/:userId', EcoController.getEcosFromUser);
ecoRouter.get('/eco/feed/:userId', EcoController.getFeed);
ecoRouter.get("/replies/:ecoId" ,EcoController.getEcoReplies);

export default ecoRouter;    
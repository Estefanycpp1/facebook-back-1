import EcoModel from "../models/eco.js";
import  { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import FollowerModel from "../models/follower.js";
import LikeModel from "../models/like.js";
import { IEco } from "../models/eco.js";

export default class EcoController {

    constructor() {}

    static createEco = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;
            const Eco = new EcoModel({ ...req.body, idUser: userId });
            const savedEco = await Eco.save();
            return ApiResponse.success(res, "Eco created", savedEco);
        } catch (error) {
            console.error(error);
            return ApiResponse.error(res, "Error creating Eco", 500);
        }
    };
    
    static getEcosFromUser = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { lastEcoDate } = req.query;

        try {
            let query: any = { idUser: userId, isReply: null, isDeleted: false };

            // Si se proporciona lastEcoDate, añade la condición de fecha en la consulta
            if (lastEcoDate) {
                query.createdAt = { $lt: new Date(lastEcoDate as string) };
            }

            const Ecos = await EcoModel.find(query)
                .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
               // .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el Eco con los campos fullName, username y email

            if (!Ecos || Ecos.length === 0) {
                return ApiResponse.notFound(res, "No Ecos found");
            }

            const likeCountsPromises = Ecos.map(async (Eco) => {
                const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
                return { ...Eco.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let Ecos2 = await Promise.all(likeCountsPromises as Promise<IEco>[]);

            const filteredEcos = Ecos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each Eco
            const userIdRequest = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEcos.map(async (Eco) => {
                const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userIdRequest }).countDocuments() > 0;
                return { ...Eco, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEcosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);

            
        } catch (error) {
            return ApiResponse.error(res, "Error getting Ecos", 500);
        }
    }

    static getFeed = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { lastEcoDate } = req.query;

        try {
            // Encuentra los usuarios que sigue el usuario actual
            const followingUsers = await FollowerModel.find({ idUser: userId }).distinct("idFollowing");

            let query: any = { idUser: { $in: followingUsers }, isDeleted:false, isReply: null };

            // Si se proporciona lastEcoDate, añade la condición de fecha en la consulta
            if (lastEcoDate) {
                query.createdAt = { $lt: new Date(lastEcoDate as string) };
            }

            const Ecos = await EcoModel.find(query)
                .sort({ createdAt: -1 })
            //    .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el Eco con los campos fullName, username y email

            if (!Ecos || Ecos.length === 0) {
                return ApiResponse.notFound(res, "No Ecos found");
            }

            const likeCountsPromises = Ecos.map(async (Eco) => {
                const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
                return { ...Eco.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let Ecos2 = await Promise.all(likeCountsPromises as Promise<IEco>[]);

            const filteredEcos = Ecos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each Eco
            const userIdRequest = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEcos.map(async (Eco) => {
                const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userIdRequest }).countDocuments() > 0;
                return { ...Eco, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEcosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);

        } catch (error) {
            return ApiResponse.error(res, "Error getting feed", 500);
        }
    }



    static getEcoById = async (req: Request, res: Response) => {
        const { EcoId } = req.params;

        try {
            const Eco = await EcoModel.findById(EcoId).populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); 
            if (!Eco) {
                return ApiResponse.notFound(res, "Eco not found");
            }


            const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();

            const Eco2 = { ...Eco.toObject(), likes: likeCount };

            //Search in database and add the field isLiked to each Eco
            const userId = (req.user as { _id: string })._id;

            const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;

            const Eco3 = { ...Eco2, isLiked: isLiked };




            return ApiResponse.success(res, "Eco retrieved", Eco3);
        } catch (error) {
            return ApiResponse.error(res, "Error getting Eco", 500);
        }
    }

    static deleteEco = async (req: Request, res: Response) => {
       const { EcoId } = req.params;

       const Eco = await EcoModel.findById(EcoId);

         if (!Eco) {
              return ApiResponse.notFound(res, "Eco not found");
         }

            Eco.isDeleted = true;

            const savedEco = await Eco.save();

            if (!savedEco) {
                return ApiResponse.error(res, "Error deleting Eco", 500);
            }

            return ApiResponse.success(res, "Eco deleted", Eco);
    }

    static getAllEcos = async (req: Request, res: Response) => {
        const { lastEcoDate } = req.query;
        const { limit = 10 } = req.query;

        try {
            let query: any = {  isReply:null, isDeleted: false };

            // Si se proporciona lastEcoDate, añade la condición de fecha en la consulta
            if (lastEcoDate) {
                query.createdAt = { $lt: new Date(lastEcoDate as string) };
            }

            let Ecos = await EcoModel.find(query)
                .sort({ createdAt: -1 })
             //   .limit(parseInt(limit as string))
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el Eco con los campos fullName, username y email

                
                if (!Ecos || Ecos.length === 0) {
                    return ApiResponse.notFound(res, "No Ecos found");
                }
                
                const likeCountsPromises = Ecos.map(async (Eco) => {
                    const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
                    return { ...Eco.toObject(), likes: likeCount };
                });
        
                // Espera a que todas las consultas asincrónicas se completen
                let Ecos2 = await Promise.all(likeCountsPromises as Promise<IEco>[]);

                //Filter Ecos2 variable and remove Ecos that .idUser.isDisabled = true
        
                const filteredEcos = Ecos2.filter(objeto => {
                    let objeto2 = objeto as any;
                    return objeto2.idUser.isDisabled === false;
                });

                //Search in database and add the field isLiked to each Eco
                const userId = (req.user as { _id: string })._id;

                const isLikedPromises = filteredEcos.map(async (Eco) => {
                    const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;
                    return { ...Eco, isLiked: isLiked };
                });

                // Espera a que todas las consultas asincrónicas se completen
                let filteredEcosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);
            
        } catch (error) {
            return ApiResponse.error(res, "Error getting Ecos", 500);
        }
    }

    static getEcoReplies = async (req: Request, res: Response) => {
        const { EcoId } = req.params;

        try {
            let query: any = { isReply: EcoId, isDeleted: false };


            const Ecos = await EcoModel.find(query)
                .sort({ createdAt: 'asc' })
                .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el Eco con los campos fullName, username y email

            if (!Ecos || Ecos.length === 0) {
                return ApiResponse.notFound(res, "No Ecos found");
            }

            const likeCountsPromises = Ecos.map(async (Eco) => {
                const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
                return { ...Eco.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let Ecos2 = await Promise.all(likeCountsPromises as Promise<IEco>[]);

            const filteredEcos = Ecos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each Eco
            const userId = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEcos.map(async (Eco) => {
                const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;
                return { ...Eco, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEcosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);

        } catch (error) {
            return ApiResponse.error(res, "Error getting Ecos", 500);
        }
    }

    static replyEco = async (req: Request, res: Response) => {
        const { userId } = req.body;
        
        const Eco = new EcoModel({
            ...req.body,
            idUser: userId
        });

        const savedEco = await Eco.save();

        if (!Eco) {
            return ApiResponse.error(res, "Error creating Eco", 400);
        }

        return ApiResponse.success(res, "Eco created", Eco);
    }


}



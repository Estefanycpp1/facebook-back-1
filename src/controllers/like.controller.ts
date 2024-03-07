import  { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import LikeModel from "../models/like.js";

export default class LikeController {

    constructor() {}

    static likeEco = async (req: Request, res: Response) => {
        const { userId, ecoId } = req.body;
        
        const like = await LikeModel.findOne({
            idUser: userId,
            idEco: ecoId
        })

        if (like) {
            return ApiResponse.error(res, "Eco alredy liked", 400);
        }

        const newLike = new LikeModel({
            idUser: userId,
            idEco: ecoId
        });

        await newLike.save();
        return ApiResponse.success(res, "Eco liked", like);
    }

    static dislikeEco = async (req: Request, res: Response) => {
        const { userId, ecoId } = req.body;

        const like = await LikeModel.findOne({
            idUser: userId,
            idEco: ecoId
        })

        if (!like) {
            return ApiResponse.error(res, "Eco not liked", 400);
        }

        await like.deleteOne();
        return ApiResponse.success(res, "Eco disliked", like);
    }




}
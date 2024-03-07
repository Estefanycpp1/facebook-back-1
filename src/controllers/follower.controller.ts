import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import FollowerModel from "../models/follower.js";

export default class followerController{

    constructor(){}

    static followUser = async (req: Request, res: Response) => {
        const { userId, idFollowing } = req.body;

        const follower = await FollowerModel.findOne({ idUser:userId, idFollowing })

        if (follower) {
            return ApiResponse.error(res, "Error following user, user already followed", 400);
        }
        
        const newFollower = new FollowerModel({idUser:userId, idFollowing});
        await newFollower.save();

        return ApiResponse.success(res, "User followed", follower);
    }

    static unfollowUser = async (req: Request, res: Response) => {
        const { userId, idFollowing } = req.body;

        const follower = await FollowerModel.findOneAndDelete({ idUser:userId, idFollowing });

        if (!follower) {
            return ApiResponse.error(res, "Error unfollowing user", 400);
        }



        return ApiResponse.success(res, "User unfollowed", follower);
    }


}
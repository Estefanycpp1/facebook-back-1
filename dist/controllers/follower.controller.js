var _a;
import ApiResponse from "../utils/ApiResponse.js";
import FollowerModel from "../models/follower.js";
class followerController {
    constructor() { }
}
_a = followerController;
followerController.followUser = async (req, res) => {
    const { userId, idFollowing } = req.body;
    const follower = await FollowerModel.findOne({ idUser: userId, idFollowing });
    if (follower) {
        return ApiResponse.error(res, "Error following user, user already followed", 400);
    }
    const newFollower = new FollowerModel({ idUser: userId, idFollowing });
    await newFollower.save();
    return ApiResponse.success(res, "User followed", follower);
};
followerController.unfollowUser = async (req, res) => {
    const { userId, idFollowing } = req.body;
    const follower = await FollowerModel.findOneAndDelete({ idUser: userId, idFollowing });
    if (!follower) {
        return ApiResponse.error(res, "Error unfollowing user", 400);
    }
    return ApiResponse.success(res, "User unfollowed", follower);
};
export default followerController;

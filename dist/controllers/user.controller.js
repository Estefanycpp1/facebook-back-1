var _a;
import FollowerModel from "../models/follower.js";
import EcoModel from "../models/eco.js";
import UserCollection from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
class UserController {
}
_a = UserController;
UserController.deleteUser = async (req, res) => {
    const { userId: id } = req.body;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    await user.deleteOne();
    return ApiResponse.success(res, "User deleted");
};
UserController.updateUserData = async (req, res) => {
    const { userId: id } = req.body;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    const updated = await user.updateData(req.body);
    if (!updated) {
        return ApiResponse.error(res, "Error updating user", 400);
    }
    return ApiResponse.success(res, "User updated");
};
UserController.searchUser = async (req, res) => {
    const { userId: id, query } = req.params;
    const users = await UserCollection.find({
        $or: [
            { username: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } }
        ],
        isDisabled: false
    });
    if (!users) {
        return ApiResponse.notFound(res, "Users not found");
    }
    const followersPromises = users.map(async (user) => {
        const followers = await FollowerModel.find({ idFollowing: user._id }).countDocuments();
        return { ...user.toObject(), followers: followers };
    });
    let users2 = await Promise.all(followersPromises);
    const followingPromises = users2.map(async (user) => {
        const following = await FollowerModel.find({ idUser: id, idFollowing: user._id }).countDocuments();
        return { ...user, isFollowing: following > 0 };
    });
    users2 = await Promise.all(followingPromises);
    return ApiResponse.success(res, "Users found", users2);
};
UserController.getProfileData = async (req, res) => {
    const { userId: id } = req.params;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    if (user.isDisabled) {
        return ApiResponse.error(res, "User is disabled");
    }
    const followers = await FollowerModel.find({ idFollowing: id }).countDocuments();
    const following = await FollowerModel.find({ idUser: id }).countDocuments();
    const ecos = await EcoModel.find({ idUser: id }).countDocuments();
    const myId = req.user._id;
    const isFollowing = await FollowerModel.find({ idUser: myId, idFollowing: id }).countDocuments() > 0;
    return ApiResponse.success(res, "User found", {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        followers: followers,
        following: following,
        ecos: ecos,
        isFollowing: isFollowing
    });
};
UserController.getAllUsers = async (req, res) => {
    const { userId: id } = req.params;
    const users = await UserCollection.find({ isDisabled: false });
    if (!users) {
        return ApiResponse.notFound(res, "Users not found");
    }
    const followersPromises = users.map(async (user) => {
        const followers = await FollowerModel.find({ idFollowing: user._id }).countDocuments();
        return { ...user.toObject(), followers: followers };
    });
    let users2 = await Promise.all(followersPromises);
    const followingPromises = users2.map(async (user) => {
        const following = await FollowerModel.find({ idUser: id, idFollowing: user._id }).countDocuments();
        return { ...user, isFollowing: following > 0 };
    });
    users2 = await Promise.all(followingPromises);
    return ApiResponse.success(res, "Users found", users2);
};
export default UserController;

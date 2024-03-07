var _a;
import EcoModel from "../models/eco.js";
import ApiResponse from "../utils/ApiResponse.js";
import FollowerModel from "../models/follower.js";
import LikeModel from "../models/like.js";
class EcoController {
    constructor() { }
}
_a = EcoController;
EcoController.createEco = async (req, res) => {
    try {
        const { userId } = req.body;
        const Eco = new EcoModel({ ...req.body, idUser: userId });
        const savedEco = await Eco.save();
        return ApiResponse.success(res, "Eco created", savedEco);
    }
    catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Error creating Eco", 500);
    }
};
EcoController.getEcosFromUser = async (req, res) => {
    const { userId } = req.params;
    const { lastEcoDate } = req.query;
    try {
        let query = { idUser: userId, isReply: null, isDeleted: false };
        if (lastEcoDate) {
            query.createdAt = { $lt: new Date(lastEcoDate) };
        }
        const Ecos = await EcoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!Ecos || Ecos.length === 0) {
            return ApiResponse.notFound(res, "No Ecos found");
        }
        const likeCountsPromises = Ecos.map(async (Eco) => {
            const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
            return { ...Eco.toObject(), likes: likeCount };
        });
        let Ecos2 = await Promise.all(likeCountsPromises);
        const filteredEcos = Ecos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userIdRequest = req.user._id;
        const isLikedPromises = filteredEcos.map(async (Eco) => {
            const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userIdRequest }).countDocuments() > 0;
            return { ...Eco, isLiked: isLiked };
        });
        let filteredEcosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting Ecos", 500);
    }
};
EcoController.getFeed = async (req, res) => {
    const { userId } = req.params;
    const { lastEcoDate } = req.query;
    try {
        const followingUsers = await FollowerModel.find({ idUser: userId }).distinct("idFollowing");
        let query = { idUser: { $in: followingUsers }, isDeleted: false, isReply: null };
        if (lastEcoDate) {
            query.createdAt = { $lt: new Date(lastEcoDate) };
        }
        const Ecos = await EcoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!Ecos || Ecos.length === 0) {
            return ApiResponse.notFound(res, "No Ecos found");
        }
        const likeCountsPromises = Ecos.map(async (Eco) => {
            const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
            return { ...Eco.toObject(), likes: likeCount };
        });
        let Ecos2 = await Promise.all(likeCountsPromises);
        const filteredEcos = Ecos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userIdRequest = req.user._id;
        const isLikedPromises = filteredEcos.map(async (Eco) => {
            const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userIdRequest }).countDocuments() > 0;
            return { ...Eco, isLiked: isLiked };
        });
        let filteredEcosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting feed", 500);
    }
};
EcoController.getEcoById = async (req, res) => {
    const { EcoId } = req.params;
    try {
        const Eco = await EcoModel.findById(EcoId).populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!Eco) {
            return ApiResponse.notFound(res, "Eco not found");
        }
        const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
        const Eco2 = { ...Eco.toObject(), likes: likeCount };
        const userId = req.user._id;
        const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;
        const Eco3 = { ...Eco2, isLiked: isLiked };
        return ApiResponse.success(res, "Eco retrieved", Eco3);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting Eco", 500);
    }
};
EcoController.deleteEco = async (req, res) => {
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
};
EcoController.getAllEcos = async (req, res) => {
    const { lastEcoDate } = req.query;
    const { limit = 10 } = req.query;
    try {
        let query = { isReply: null, isDeleted: false };
        if (lastEcoDate) {
            query.createdAt = { $lt: new Date(lastEcoDate) };
        }
        let Ecos = await EcoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!Ecos || Ecos.length === 0) {
            return ApiResponse.notFound(res, "No Ecos found");
        }
        const likeCountsPromises = Ecos.map(async (Eco) => {
            const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
            return { ...Eco.toObject(), likes: likeCount };
        });
        let Ecos2 = await Promise.all(likeCountsPromises);
        const filteredEcos = Ecos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userId = req.user._id;
        const isLikedPromises = filteredEcos.map(async (Eco) => {
            const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;
            return { ...Eco, isLiked: isLiked };
        });
        let filteredEcosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting Ecos", 500);
    }
};
EcoController.getEcoReplies = async (req, res) => {
    const { EcoId } = req.params;
    try {
        let query = { isReply: EcoId, isDeleted: false };
        const Ecos = await EcoModel.find(query)
            .sort({ createdAt: 'asc' })
            .limit(10)
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!Ecos || Ecos.length === 0) {
            return ApiResponse.notFound(res, "No Ecos found");
        }
        const likeCountsPromises = Ecos.map(async (Eco) => {
            const likeCount = await LikeModel.find({ idEco: Eco._id }).countDocuments();
            return { ...Eco.toObject(), likes: likeCount };
        });
        let Ecos2 = await Promise.all(likeCountsPromises);
        const filteredEcos = Ecos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userId = req.user._id;
        const isLikedPromises = filteredEcos.map(async (Eco) => {
            const isLiked = await LikeModel.find({ idEco: Eco._id, idUser: userId }).countDocuments() > 0;
            return { ...Eco, isLiked: isLiked };
        });
        let filteredEcosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Ecos retrieved", filteredEcosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting Ecos", 500);
    }
};
EcoController.replyEco = async (req, res) => {
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
};
export default EcoController;

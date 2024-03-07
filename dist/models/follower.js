import { model, Schema } from "mongoose";
import "dotenv/config";
const followerSchema = new Schema({
    idUser: {
        type: String,
        required: true,
        ref: "User",
    },
    idFollowing: {
        type: String,
        required: true,
        ref: "User",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
const FollowerModel = model("Follower", followerSchema);
export default FollowerModel;

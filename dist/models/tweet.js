import { model, Schema } from "mongoose";
import "dotenv/config";
const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    idUser: {
        type: String,
        required: true,
        ref: "User",
    },
    isReply: {
        type: Schema.Types.Mixed,
        default: null,
    },
    attachmentUrls: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    mentions: {
        type: [String],
        default: [],
    },
    hashtags: {
        type: [String],
        default: [],
    }
});
tweetSchema.methods.updateData = async function (tweetData) {
    const tweet = this;
    if (tweetData.content)
        tweet.content = tweetData.content;
    if (tweetData.attachmentUrls)
        tweet.attachmentUrls = tweetData.attachmentUrls;
    if (tweetData.mentions)
        tweet.mentions = tweetData.mentions;
    if (tweetData.hashtags)
        tweet.hashtags = tweetData.hashtags;
    if (tweetData.isDeleted !== undefined)
        tweet.isDeleted = tweetData.isDeleted;
    if (tweetData.isEdited !== undefined)
        tweet.isEdited = tweetData.isEdited;
    if (tweetData.isReply !== undefined)
        tweet.isReply = tweetData.isReply;
    await tweet.save();
    return true;
};
const TweetModel = model("Tweet", tweetSchema);
export default TweetModel;

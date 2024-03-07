import { model, Schema, Document } from "mongoose";
import "dotenv/config";

export interface ILike extends Document {
  idUser : string;
  idEco : string;
  createdAt: Date;
}

const likeSchema: Schema<ILike> = new Schema<ILike>({
  idUser: {
    type: String,
    required: true,
    ref: "User",
  },
  idEco: {
    type: String,
    required: true,
    ref: "eco",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

const LikeModel = model<ILike>("Like", likeSchema);

export default LikeModel;

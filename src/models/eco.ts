import { model, Schema, Document } from "mongoose";
import "dotenv/config";

export interface IEco extends Document {
  content: string;
  idUser: string;
  attachmentUrls: string[];
  mentions: string[];
  hashtags: string[];
  isDeleted: boolean;
  isEdited: boolean;
  isReply: string | null;
  createdAt: Date;
  likes: number;
  updateData: (ecoData: {
    content?: string;
    attachmentUrls?: string[];
    mentions?: string[];
    hashtags?: string[];
    isDeleted?: boolean;
    isEdited?: boolean;
    isReply?: string | null;
  }) => Promise<boolean>;
}

const ecoSchema: Schema<IEco> = new Schema<IEco>({
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
    default:[]
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

ecoSchema.methods.updateData = async function (
  ecoData: {
    content?: string;
    attachmentUrls?: string[];
    mentions?: string[];
    hashtags?: string[];
    isDeleted?: boolean;
    isEdited?: boolean;
    isReply?: string | null;
  }
): Promise<boolean> {
  const eco = this;

  if (ecoData.content) eco.content = ecoData.content;
  if (ecoData.attachmentUrls) eco.attachmentUrls = ecoData.attachmentUrls;
  if (ecoData.mentions) eco.mentions = ecoData.mentions;
  if (ecoData.hashtags) eco.hashtags = ecoData.hashtags;
  if (ecoData.isDeleted !== undefined) eco.isDeleted = ecoData.isDeleted;
  if (ecoData.isEdited !== undefined) eco.isEdited = ecoData.isEdited;
  if (ecoData.isReply !== undefined) eco.isReply = ecoData.isReply;

  await eco.save();
  return true;
};

const EcoModel = model<IEco>("Eco", ecoSchema);

export default EcoModel;

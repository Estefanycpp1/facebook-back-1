import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  username: string;
  isDisabled: boolean;
  createdAt: Date;
  isVerified: boolean;
  bio: string;
  profilePicture: string;
  firstLogin: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  updateData: (userData: {
    fullName?: string;
    email?: string;
    username?: string;
    oldPassword?: string;
    newPassword?: string;
    isDisabled?: boolean;
    isVerified?: boolean;
    bio?: string;
    profilePicture?: string;
  }) => Promise<boolean>;
  createToken: (user:any) => Promise<string>;
}

const userSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
  },
  firstLogin: {
    type: Boolean,
    default: true,
  }
});



userSchema.pre<IUser>("save", async function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  user.email = user.email.toLowerCase();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function(
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateData = async function (
  userData: {
    fullName?: string;
    email?: string;
    username?: string;
    oldPassword?: string;
    newPassword?: string;
    isDisabled?: boolean;
    isVerified?: boolean;
    bio?: string;
    profilePicture?: string;
  }
): Promise<boolean> {
  const user = this;

  if (userData.newPassword) {
    if (!(await user.comparePassword(userData.oldPassword))) return false;
    user.password = userData.newPassword;
  }

  if (userData.fullName) {user.fullName = userData.fullName;}
  if (userData.email) {
    user.email = userData.email;
  }
  if (userData.username) user.username = userData.username;
  if (userData.isDisabled ) user.isDisabled = userData.isDisabled;
  if (userData.bio ) user.bio = userData.bio;
  if (userData.profilePicture ) user.profilePicture = userData.profilePicture;

  if (userData.isVerified ) user.isVerified = userData.isVerified;
  await user.save();
  return true;
};

userSchema.methods.createToken = async function(user:IUser):Promise<string>{
  return jwt.sign(
    {id:user.id},
     process.env.JWT_SECRET || "secret",
    {expiresIn: 60*60*24*7}
  )
}

  

const userCollection = model<IUser>("User", userSchema);

export default userCollection;
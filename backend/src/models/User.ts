import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  isPremium: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

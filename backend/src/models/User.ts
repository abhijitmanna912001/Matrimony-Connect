import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  isPremium: boolean;
  createdAt: Date;

  // Profile fields
  gender?: string;
  dateOfBirth?: Date;
  religion?: string;
  caste?: string;
  education?: string;
  profession?: string;
  income?: string;
  location?: string;
  bio?: string;

  // Preferences
  preferences?: {
    ageRange?: number[];
    religion?: string;
    caste?: string;
    location?: string;
    education?: string;
    income?: string;
  };

  // Interest system
  interestsSent?: Types.ObjectId[];
  interestsReceived?: Types.ObjectId[];

  // Shortlist/Block Users
  shortlistedUsers?: Types.ObjectId[];
  blockedUsers?: Types.ObjectId[];

  // Additional fields
  isApproved: boolean;
  photoStatus: "pending" | "approved" | "rejected";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // Role & premium
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isPremium: { type: Boolean, default: false },

    // Profile
    gender: { type: String },
    dateOfBirth: { type: Date },
    religion: { type: String },
    caste: { type: String },
    education: { type: String },
    profession: { type: String },
    income: { type: String },
    location: { type: String },
    bio: { type: String },

    // Preferences
    preferences: {
      ageRange: { type: [Number], default: [20, 35] },
      religion: { type: String },
      caste: { type: String },
      location: { type: String },
      education: { type: String },
      income: { type: String },
    },

    // Interests
    interestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    interestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    shortlistedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // ✅ Newly added fields
    isApproved: { type: Boolean, default: false },
    photoStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { versionKey: false }
);

export const User = mongoose.model<IUser>("User", userSchema);

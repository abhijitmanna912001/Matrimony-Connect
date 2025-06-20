import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_CLUSTER,
      MONGO_DB_NAME,
      MONGODB_APP_NAME,
    } = process.env;

    const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`;

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

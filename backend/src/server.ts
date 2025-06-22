import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import blockRoutes from "./routes/block.routes.js";
import interestRoutes from "./routes/interest.routes.js";
import matchRoutes from "./routes/match.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import shortlistRoutes from "./routes/shortlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/shortlist", shortlistRoutes);
app.use("/api/block", blockRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_req, res) => {
  res.send("Matrimony Connect API is running");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

import dotenv from "dotenv";
dotenv.config();

export default {
  MONGO_DATABASE: process.env.MONGO_DATABASE || "vehiclesdb",
  MONGO_USER: process.env.MONGO_USER || "",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || "",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost",
  PORT: process.env.PORT || 3000,
};

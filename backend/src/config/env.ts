import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const MONGO_URI: string = mongoUri;
export const JWT_SECRET: string = jwtSecret;

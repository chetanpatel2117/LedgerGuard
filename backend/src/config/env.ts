import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/ledgerguard";
const jwtSecret = process.env.JWT_SECRET ?? "local-dev-secret";

if (!process.env.MONGO_URI) {
  console.warn("MONGO_URI not set; using local default mongodb://127.0.0.1:27017/ledgerguard");
}

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set; using local fallback secret");
}

export const MONGO_URI: string = mongoUri;
export const JWT_SECRET: string = jwtSecret;
export const env = {
  mongoUri,
  jwtSecret,
};

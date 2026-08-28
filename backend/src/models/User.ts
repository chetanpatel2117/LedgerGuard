import { Schema } from "mongoose";
import { getAuthConnection } from "../config/authConnection";

export interface IUser {
  email: string;
  password: string;
  tenantId: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    tenantId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export async function getUserModel() {
  const connection = await getAuthConnection();

  return (
    connection.models.User ||
    connection.model<IUser>("User", userSchema)
  );
}
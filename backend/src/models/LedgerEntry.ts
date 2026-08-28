import { Schema } from "mongoose";

export const ledgerEntrySchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
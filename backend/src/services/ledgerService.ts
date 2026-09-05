import { Connection } from "mongoose";
import { randomUUID } from "crypto";

import ledgerEntrySchema from "../models/LedgerEntry";

interface CreateLedgerEntryInput {
  tenantId: string;
  userId: string;
  eventId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  reference: string;
}

export const createLedgerEntry = async (
  connection: Connection,
  input: CreateLedgerEntryInput
) => {
  const LedgerEntry =
    connection.models.LedgerEntry ||
    connection.model("LedgerEntry", ledgerEntrySchema);

  // First idempotency check
  const existingEntry = await LedgerEntry.findOne({
    eventId: input.eventId,
  });

  if (existingEntry) {
    return existingEntry;
  }

  try {
    return await LedgerEntry.create({
      tenantId: input.tenantId,
      eventId: input.eventId,
      transactionId: randomUUID(),
      type: input.type,
      amount: input.amount,
      description: input.description,
      reference: input.reference,
      createdBy: input.userId,
    });
  } catch (error: any) {
    // The unique eventId index makes concurrent retries idempotent.
    if (error?.code === 11000) {
      const existingEntry = await LedgerEntry.findOne({ eventId: input.eventId });
      if (existingEntry) return existingEntry;
    }
    throw error;
  }
};

export const getLedgerEntries = async (
  connection: Connection
) => {
  const LedgerEntry =
    connection.models.LedgerEntry ||
    connection.model("LedgerEntry", ledgerEntrySchema);

  return LedgerEntry
    .find()
    .sort({ createdAt: -1 })
    .lean();
};
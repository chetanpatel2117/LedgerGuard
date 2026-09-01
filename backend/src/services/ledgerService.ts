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

  const session = await connection.startSession();

  try {
    let entry;

    try {
      await session.withTransaction(async () => {
        const transactionId = randomUUID();

        const entries = await LedgerEntry.create(
          [
            {
              tenantId: input.tenantId,
              eventId: input.eventId,
              transactionId,
              type: input.type,
              amount: input.amount,
              description: input.description,
              reference: input.reference,
              createdBy: input.userId,
            },
          ],
          { session }
        );

        entry = entries[0];
      });
    } catch (error: any) {
      // Another request may have created the same event
      if (error?.code === 11000) {
        const existingEntry = await LedgerEntry.findOne({
          eventId: input.eventId,
        });

        if (existingEntry) {
          return existingEntry;
        }
      }

      throw error;
    }

    return entry;
  } finally {
    await session.endSession();
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
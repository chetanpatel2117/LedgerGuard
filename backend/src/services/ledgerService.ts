import { Connection } from "mongoose";
import { ledgerEntrySchema } from "../models/LedgerEntry";

interface CreateLedgerEntryInput {
  tenantId: string;
  userId: string;
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

  const entry = await LedgerEntry.create({
    tenantId: input.tenantId,
    type: input.type,
    amount: input.amount,
    description: input.description,
    reference: input.reference,
    createdBy: input.userId,
  });

  return entry;
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
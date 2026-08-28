import { Router } from "express";

import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

import { getTenantConnection } from "../db/connectionManager";

import {
  createLedgerEntry,
  getLedgerEntries,
} from "../services/ledgerService";
const router = Router();

router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { type, amount, description, reference } = req.body;

      if (
        (type !== "CREDIT" && type !== "DEBIT") ||
        typeof amount !== "number" ||
        amount <= 0 ||
        typeof description !== "string" ||
        typeof reference !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ledger entry data",
        });
      }

      const tenantId = req.user!.tenantId;
      const userId = req.user!.userId;

      const connection = await getTenantConnection(tenantId);

      const entry = await createLedgerEntry(connection, {
        tenantId,
        userId,
        type,
        amount,
        description,
        reference,
      });

      return res.status(201).json({
        success: true,
        entry,
      });
    } catch (error) {
      console.error("Ledger creation error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create ledger entry",
      });
    }
  }
);



router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const tenantId = req.user!.tenantId;

      const connection = await getTenantConnection(tenantId);

      const entries = await getLedgerEntries(connection);

      return res.json({
        success: true,
        tenantId,
        entries,
      });
    } catch (error) {
      console.error("Ledger retrieval error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve ledger entries",
      });
    }
  }
);

export default router;
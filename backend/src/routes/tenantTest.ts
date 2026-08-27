import { Router } from "express";
import { getTenantConnection } from "../db/connectionManager";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const tenantId = req.user!.tenantId;

      const connection = await getTenantConnection(tenantId);

      if (!connection.db) {
        throw new Error("Tenant database connection is not available");
      }

      const collection = connection.db.collection("tenantTests");

      const result = await collection.insertOne({
        tenantId,
        userId: req.user!.userId,
        message: `Data belongs to ${tenantId}`,
        createdAt: new Date(),
      });

      res.json({
        success: true,
        userId: req.user!.userId,
        tenantId,
        database: connection.name,
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to access tenant database",
      });
    }
  }
);

export default router;
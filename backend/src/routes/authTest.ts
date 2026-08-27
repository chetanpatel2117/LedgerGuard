import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const router = Router();

router.post("/token", (req, res) => {
  const { userId, tenantId } = req.body;

  if (!userId || !tenantId) {
    return res.status(400).json({
      success: false,
      message: "userId and tenantId are required",
    });
  }

  const token = jwt.sign(
    {
      userId,
      tenantId,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    success: true,
    token,
  });
});

export default router;
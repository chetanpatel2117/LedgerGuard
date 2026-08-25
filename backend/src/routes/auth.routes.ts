import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  if (email !== "admin@ledgerguard.com" || password !== "password123") {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      tenantId: "tenant-001",
      role: "admin",
    },
    env.jwtSecret,
    {
      subject: "user-001",
      expiresIn: "1h",
    },
  );

  return res.json({
    message: "Login successful",
    token,
  });
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

export default router;

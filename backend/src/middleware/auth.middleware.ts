import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedUser } from "../types/auth";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const { sub, tenantId, role } = decoded;

    if (
      typeof sub !== "string" ||
      typeof tenantId !== "string" ||
      typeof role !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token payload",
      });
    }

    const user: AuthenticatedUser = {
      userId: sub,
      tenantId,
      role,
    };

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

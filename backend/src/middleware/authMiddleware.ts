import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { AuthenticatedUser } from "../types/auth";

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "JWT token is missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (typeof decoded === "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT payload",
      });
    }

    const userId = decoded.userId;
    const tenantId = decoded.tenantId;
    const role = decoded.role ?? "user";

    if (
      typeof userId !== "string" ||
      typeof tenantId !== "string" ||
      typeof role !== "string" ||
      !userId ||
      !tenantId
    ) {
      return res.status(401).json({
        success: false,
        message: "JWT does not contain valid user or tenant information",
      });
    }

    const user: AuthenticatedUser = {
      userId,
      tenantId,
      role,
    };

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT",
    });
  }
}
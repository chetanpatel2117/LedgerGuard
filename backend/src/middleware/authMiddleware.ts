import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface JwtPayload {
  userId: string;
  tenantId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
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

    if (
      typeof userId !== "string" ||
      typeof tenantId !== "string" ||
      !userId ||
      !tenantId
    ) {
      return res.status(401).json({
        success: false,
        message: "JWT does not contain valid user or tenant information",
      });
    }

    req.user = {
      userId,
      tenantId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT",
    });
  }
}
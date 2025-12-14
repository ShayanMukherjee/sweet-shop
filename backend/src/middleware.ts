import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/* 🔐 SINGLE SOURCE OF TRUTH FOR JWT SECRET */
export const SECRET = process.env.JWT_SECRET || "supersecretkey";

/* 🔹 Typed request */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "USER" | "ADMIN";
  };
}

/* 🔐 AUTHENTICATE USER */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* 🔐 ADMIN ONLY */
export function authorizeAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin only" });
  }

  next();
}

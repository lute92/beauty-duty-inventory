// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "test"

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({error: "Invalid token!"});
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({error: "Authentication failed!"});
    }
    req.user = user;
    next();
    return;
  });

  return;
};

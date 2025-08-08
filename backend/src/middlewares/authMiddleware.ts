import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Try to get token from HTTP-only cookie first
  let token = req.cookies?.authToken;

  // 2. Fallback to Authorization header if no cookie
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // 3. Reject if no token found
  if (!token) {
    return res.status(401).json({ 
      error: 'Authentication required',
      hints: [
        'Send token via:',
        '1. HTTP-only cookie (preferred)',
        '2. Authorization: Bearer <token> header'
      ]
    });
  }

  // 4. Verify token
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    // Handle specific JWT errors
    const errorResponse: { 
      error: string; 
      shouldClearCookie?: boolean 
    } = {
      error: 'Invalid or expired token'
    };

    // Suggest clearing cookie for certain errors
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      errorResponse.shouldClearCookie = true;
      res.clearCookie('authToken', {
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
      });
    }

    return res.status(401).json(errorResponse);
  }
};
import jwt, { Secret } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

export interface TokenPayload {
  sub: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret: Secret = config.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: config.JWT_EXPIRES_IN as any });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & TokenPayload;
  if (!decoded.sub) throw new Error('Malformed token payload');
  return { sub: decoded.sub, role: decoded.role };
};

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../modules/auth/user.model';
import { AUTH_CONFIG } from '../config/auth.config';

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const accessToken = req.cookies?.[AUTH_CONFIG.accessToken.cookieName];

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as AccessTokenPayload;

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user as IUser;
      next();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token Expired' });
      }
      return res.status(401).json({ message: 'Invalid Access Token' });
    }
  } catch (error) {
    console.error('Error in Protect Route:', error);
    return res.status(500).json({ message: 'Route Protection Error' });
  }
};
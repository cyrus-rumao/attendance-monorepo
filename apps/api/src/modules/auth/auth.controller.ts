import User from './user.model';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from '../../config/redis';
import { CookieOptions, Request, Response } from 'express';
import { AUTH_CONFIG } from '../../config/auth.config';
interface TokenPayload extends JwtPayload {
  userId: string;
}

const getRefreshTokenKey = (userId: string): string => `refresh_token:${userId}`;

const createCookieOptions = (maxAge: number): CookieOptions => ({
  ...AUTH_CONFIG.cookie,
  maxAge,
});

const getTokenFromCookies = (req: Request, cookieName: string): string | undefined =>
  req.cookies?.[cookieName];

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: AUTH_CONFIG.accessToken.expiresIn,
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: AUTH_CONFIG.refreshToken.expiresIn,
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (refreshToken: string, userId: string): Promise<void> => {
  const user = await User.findById(userId).select('email');
  if (!user) return;

  await redis.hset(getRefreshTokenKey(userId), 'token', refreshToken, 'email', user.email);

  await redis.expire(getRefreshTokenKey(userId), AUTH_CONFIG.refreshToken.redisTTL);
};

const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie(
    AUTH_CONFIG.accessToken.cookieName,
    accessToken,
    createCookieOptions(AUTH_CONFIG.accessToken.maxAge),
  );

  res.cookie(
    AUTH_CONFIG.refreshToken.cookieName,
    refreshToken,
    createCookieOptions(AUTH_CONFIG.refreshToken.maxAge),
  );
};

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body; // Zod already validated

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    await storeRefreshToken(refreshToken, user._id.toString());
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        __v: user.__v,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error in Signup' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    await storeRefreshToken(refreshToken, user._id.toString());
    setCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        __v: user.__v,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = getTokenFromCookies(req, AUTH_CONFIG.refreshToken.cookieName);
    if (!token) {
      return res.status(400).json({ message: 'No Refresh Token Found' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as TokenPayload;

    await redis.del(getRefreshTokenKey(decoded.userId));

    res.clearCookie(AUTH_CONFIG.accessToken.cookieName, AUTH_CONFIG.cookie);

    res.clearCookie(AUTH_CONFIG.refreshToken.cookieName, AUTH_CONFIG.cookie);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: 'Logout failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = getTokenFromCookies(req, AUTH_CONFIG.refreshToken.cookieName);
    if (!token) {
      return res.status(400).json({ message: 'No Refresh Token Found' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as TokenPayload;

    const storedToken = await redis.hget(getRefreshTokenKey(decoded.userId), 'token');

    if (storedToken !== token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: AUTH_CONFIG.accessToken.expiresIn },
    );

    res.cookie(
      AUTH_CONFIG.accessToken.cookieName,
      accessToken,
      createCookieOptions(AUTH_CONFIG.accessToken.maxAge),
    );

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: 'Token refresh failed' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(user);
};

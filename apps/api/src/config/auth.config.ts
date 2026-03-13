export const AUTH_CONFIG = {
  accessToken: {
    expiresIn: '15m',
    cookieName: 'accessToken',
    maxAge: 15 * 60 * 1000,
  },

  refreshToken: {
    expiresIn: '7d',
    cookieName: 'refreshToken',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    redisTTL: 7 * 24 * 60 * 60,
  },

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    
  },
} as const;


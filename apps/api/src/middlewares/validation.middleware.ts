import { Request, Response, NextFunction } from 'express';
import { SignupInputSchema, LoginInputSchema } from '@attendance/schemas';

export const signupValidation = (req: Request, res: Response, next: NextFunction): void => {
  const result = SignupInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: result.error.issues[0].message,
    });
    return;
  }

  req.body = result.data;
  next();
};
export const loginValidation = (req: Request, res: Response, next: NextFunction): void => {
  const result = LoginInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: result.error.issues[0].message,
    });
    return;
  }

  req.body = result.data;
  next();
};

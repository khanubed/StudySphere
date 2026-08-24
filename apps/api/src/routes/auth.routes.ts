import { Router } from 'express';
import { loginSchema, registerSchema } from '@studysphere/shared-schemas';

export const authRouter = Router();

authRouter.post('/register', (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: 'mock-user-id',
        email: data.email,
        name: data.name,
        role: data.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 'mock-user-id',
          email: data.email,
          name: data.email.split('@')[0],
          role: 'student',
        },
        token: 'mock-jwt-token',
      },
    });
  } catch (error) {
    next(error);
  }
});

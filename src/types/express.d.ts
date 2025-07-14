import { User } from '../core/entities/User';

declare global {
  namespace Express {
    interface Request {
      flash(type: string, message?: string): string[] | void;
    }
    
    interface User {
      id: string;
      name: string;
      email: string;
      password: string;
      createdAt: Date;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    flash: { [key: string]: string[] };
  }
}

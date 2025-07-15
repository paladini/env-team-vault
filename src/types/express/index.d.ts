import { User } from '../../core/entities/User';

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}

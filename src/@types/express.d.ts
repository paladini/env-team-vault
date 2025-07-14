declare global {
  namespace Express {
    interface Request {
      flash: (type: string, message?: string) => string[] | void;
    }
    
    interface Session {
      flash?: Record<string, string[]>;
    }
  }
}

export {};

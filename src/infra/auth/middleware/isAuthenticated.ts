import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Skip session-based authentication for API token endpoints
  if (req.path.startsWith('/api/vault/')) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }
  
  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Otherwise redirect to login
  res.redirect('/login');
}

export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  // If user is already logged in, redirect to dashboard
  res.redirect('/');
}

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../../core/use-cases/UserService';
import passport from 'passport';

export class AuthController {
  constructor(private userService: UserService) {}

  // GET /login
  getLogin = (req: Request, res: Response) => {
    const error = req.flash('error')[0] || null;
    res.render('login', { error, title: 'Login' });
  };

  // POST /login
  postLogin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  };

  // GET /register
  getRegister = (req: Request, res: Response) => {
    const error = req.flash('error')[0] || null;
    res.render('register', { error, title: 'Register' });
  };

  // POST /register
  postRegister = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/register');
      }

      const user = await this.userService.register({ name, email, password });
      
      // Auto login after registration
      req.login(user, (err) => {
        if (err) {
          req.flash('error', 'Registration successful but login failed');
          return res.redirect('/login');
        }
        res.redirect('/');
      });
    } catch (error: any) {
      req.flash('error', error.message || 'Registration failed');
      res.redirect('/register');
    }
  };

  // POST /logout
  logout = (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/login');
    });
  };
}

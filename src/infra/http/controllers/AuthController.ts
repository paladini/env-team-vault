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
      const { name, email, password, teamOption, teamName, teamCode } = req.body;

      if (!name || !email || !password) {
        req.flash('error', 'Name, email and password are required');
        return res.redirect('/register');
      }

      let user;

      if (teamOption === 'create') {
        // Create new team
        if (!teamName) {
          req.flash('error', 'Team name is required when creating a new team');
          return res.redirect('/register');
        }

        user = await this.userService.registerWithTeam({ 
          name, 
          email, 
          password,
          teamName: teamName.trim()
        });
      } else if (teamOption === 'join') {
        // Join existing team
        if (!teamCode) {
          req.flash('error', 'Team code is required when joining an existing team');
          return res.redirect('/register');
        }

        user = await this.userService.registerWithCode({
          name,
          email,
          password,
          teamCode: teamCode.trim().toUpperCase()
        });
      } else {
        req.flash('error', 'Please select whether to create a new team or join an existing one');
        return res.redirect('/register');
      }
      
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

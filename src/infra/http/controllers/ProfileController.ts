import { Request, Response } from 'express';
import { prisma } from '../../database/prisma';

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.redirect('/login');

    // Fetch API tokens for the user
    const tokens = await prisma.apiToken.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.render('profile', { 
      user: user, 
      tokens, 
      title: 'Profile', 
      currentPage: 'profile' 
    });
  }
}

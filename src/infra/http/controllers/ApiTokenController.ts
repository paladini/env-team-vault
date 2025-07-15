/**
 * @fileoverview Extends Express types to ensure req.user includes the id property.
 */
/// <reference path="../../../types/express/index.d.ts" />

import { Request, Response } from 'express';
import { PrismaApiTokenRepository } from '../../database/PrismaApiTokenRepository';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const apiTokenRepo = new PrismaApiTokenRepository(prisma);

export class ApiTokenController {
  // POST /api/token (create new token)
  async createToken(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const token = uuidv4() + uuidv4();
    const apiToken = await apiTokenRepo.create(userId, token);
    res.json({ token: apiToken.token, createdAt: apiToken.createdAt });
  }

  // GET /api/token (list tokens)
  async listTokens(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const tokens = await apiTokenRepo.listByUser(userId);
    res.json(tokens.map(t => ({ token: t.token, createdAt: t.createdAt, revoked: t.revoked })));
  }

  // POST /api/token/revoke (revoke token)
  async revokeToken(req: Request, res: Response) {
    const userId = req.user?.id;
    const { token } = req.body;
    if (!userId || !token) return res.status(400).json({ error: 'Missing user or token' });
    const found = await apiTokenRepo.findByToken(token);
    if (!found || found.userId !== userId) return res.status(404).json({ error: 'Token not found' });
    await apiTokenRepo.revoke(token);
    res.json({ success: true });
  }
}

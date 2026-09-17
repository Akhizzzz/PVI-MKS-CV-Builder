import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleEnhanceRequest } from '../_lib/enhanceHandler.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const result = await handleEnhanceRequest(req.body);
  res.status(result.status).json(result.body);
}

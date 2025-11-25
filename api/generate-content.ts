import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// In-memory rate limiting store (resets on cold starts)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');
const WHITELISTED_IPS = process.env.WHITELISTED_IPS?.split(',').map(ip => ip.trim()) || [];

const getClientIP = (req: VercelRequest): string => {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    'unknown'
  );
};

const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  // Whitelist bypass
  if (WHITELISTED_IPS.includes(ip)) {
    return { allowed: true };
  }

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // First request or window expired
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  // Within window
  if (record.count < RATE_LIMIT_MAX_REQUESTS) {
    record.count++;
    return { allowed: true };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    retryAfter: Math.ceil((record.resetTime - now) / 1000),
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitResult = checkRateLimit(clientIP);

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: rateLimitResult.retryAfter,
    });
  }

  // API Key check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { model, contents, config } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

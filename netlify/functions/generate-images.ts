import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// In-memory rate limiting store (resets on cold starts)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');
const WHITELISTED_IPS = process.env.WHITELISTED_IPS?.split(',').map(ip => ip.trim()) || [];

const getClientIP = (event: HandlerEvent): string => {
  return (
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown'
  );
};

const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  if (WHITELISTED_IPS.includes(ip)) {
    return { allowed: true };
  }

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (record.count < RATE_LIMIT_MAX_REQUESTS) {
    record.count++;
    return { allowed: true };
  }

  return {
    allowed: false,
    retryAfter: Math.ceil((record.resetTime - now) / 1000),
  };
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Rate limiting
  const clientIP = getClientIP(event);
  const rateLimitResult = checkRateLimit(clientIP);

  if (!rateLimitResult.allowed) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: rateLimitResult.retryAfter,
      }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'API key not configured' }),
    };
  }

  try {
    const { model, prompt, config } = JSON.parse(event.body || '{}');

    if (!model || !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateImages({
      model,
      prompt,
      config,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to generate images',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WHITELISTED_IPS = process.env.WHITELISTED_IPS 
  ? process.env.WHITELISTED_IPS.split(',').map(ip => ip.trim())
  : [];

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes default
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'); // 10 requests default

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Custom rate limiter that skips whitelisted IPs
const createRateLimiter = () => {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: RATE_LIMIT_WINDOW_MS / 1000,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Get client IP (considering proxies)
      const clientIp = req.ip || 
                       req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
                       req.headers['x-real-ip']?.toString() ||
                       req.socket.remoteAddress;
      
      const isWhitelisted = WHITELISTED_IPS.includes(clientIp || '');
      
      if (isWhitelisted) {
        console.log(`[WHITELIST] Request from whitelisted IP: ${clientIp}`);
      } else {
        console.log(`[RATE LIMIT] Request from IP: ${clientIp}`);
      }
      
      return isWhitelisted;
    },
    keyGenerator: (req) => {
      return req.ip || 
             req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             req.headers['x-real-ip']?.toString() ||
             req.socket.remoteAddress || 
             'unknown';
    },
  });
};

const limiter = createRateLimiter();

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Health check endpoint (no rate limit)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    rateLimitConfig: {
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      whitelistedIPs: WHITELISTED_IPS.length,
    }
  });
});

// Gemini API proxy endpoints
app.post('/api/generate-content', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    
    if (!model || !contents) {
      return res.status(400).json({ error: 'Missing required fields: model, contents' });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/generate-images', async (req, res) => {
  try {
    const { model, prompt, config } = req.body;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: model, prompt' });
    }

    const response = await ai.models.generateImages({
      model,
      prompt,
      config,
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ 
      error: 'Failed to generate images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Q Panda Studio API Server running on port ${PORT}`);
  console.log(`📊 Rate Limit: ${RATE_LIMIT_MAX_REQUESTS} requests per ${RATE_LIMIT_WINDOW_MS / 1000 / 60} minutes`);
  console.log(`🔐 Whitelisted IPs: ${WHITELISTED_IPS.length > 0 ? WHITELISTED_IPS.join(', ') : 'None'}`);
  console.log(`🌐 CORS enabled for all origins`);
});

export default app;

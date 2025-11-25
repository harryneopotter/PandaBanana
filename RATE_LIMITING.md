# Rate Limiting & IP Whitelisting Setup

This guide explains how to configure and use the rate limiting and IP whitelisting features in Q Panda Studio.

## Overview

Q Panda Studio now includes a backend API server that provides:
- **Rate Limiting**: Prevents API abuse by limiting requests per IP address
- **IP Whitelisting**: Allows specific IPs to bypass rate limits
- **Secure API Key Management**: Keeps your Gemini API key server-side

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Client    │────────▶│  API Server  │────────▶│  Gemini API    │
│  (React)    │         │  (Express)   │         │                │
└─────────────┘         └──────────────┘         └────────────────┘
                              │
                              ├─ Rate Limiting
                              ├─ IP Whitelisting
                              └─ API Key Security
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key

# API Server Configuration
PORT=3001

# Rate Limiting Configuration
# Time window in milliseconds (default: 900000 = 15 minutes)
RATE_LIMIT_WINDOW_MS=900000

# Maximum requests per IP per time window (default: 10)
RATE_LIMIT_MAX_REQUESTS=10

# Whitelisted IPs (comma-separated, no spaces)
# These IPs will bypass rate limiting entirely
WHITELISTED_IPS=127.0.0.1,192.168.1.100

# Client Configuration
# Enable API proxy (recommended for production)
VITE_USE_API_PROXY=true

# API server URL
VITE_API_URL=http://localhost:3001
```

### 3. Running the Application

#### Development Mode (with API Server)

Run both the frontend and API server simultaneously:

```bash
npm run dev:full
```

This starts:
- Frontend (Vite): `http://localhost:5173`
- API Server: `http://localhost:3001`

#### Separate Processes

You can also run them separately:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API Server
npm run dev:server
```

#### Production Mode

Build both frontend and backend:

```bash
npm run build
npm run build:server
```

Run the API server:

```bash
npm run start:server
```

## Configuration Options

### Rate Limiting

**`RATE_LIMIT_WINDOW_MS`**
- Time window for rate limiting in milliseconds
- Default: `900000` (15 minutes)
- Example: `3600000` = 1 hour

**`RATE_LIMIT_MAX_REQUESTS`**
- Maximum number of requests allowed per IP per time window
- Default: `10`
- Recommended: 5-20 depending on your use case

### IP Whitelisting

**`WHITELISTED_IPS`**
- Comma-separated list of IP addresses that bypass rate limiting
- Format: `IP1,IP2,IP3` (no spaces)
- Example: `127.0.0.1,192.168.1.100,10.0.0.5`
- Use cases:
  - Development machines
  - Testing environments
  - Trusted admin IPs
  - CI/CD pipelines

**Finding Your IP Address:**

```bash
# On Linux/Mac
curl ifconfig.me

# Or
curl api.ipify.org

# Windows (PowerShell)
(Invoke-WebRequest -Uri "http://ifconfig.me/ip").Content
```

### Client Configuration

**`VITE_USE_API_PROXY`**
- Set to `true` to route all API calls through the backend server
- Set to `false` to call Gemini API directly from client (not recommended for production)
- Default: `true`

**`VITE_API_URL`**
- URL of your API server
- Development: `http://localhost:3001`
- Production: `https://your-domain.com`

## API Endpoints

The server exposes the following endpoints:

### Health Check
```
GET /health
```
Returns server status and configuration (no rate limiting applied).

### Generate Content
```
POST /api/generate-content
```
Proxies content generation requests to Gemini API (rate limited).

### Generate Images
```
POST /api/generate-images
```
Proxies image generation requests to Gemini API (rate limited).

## Rate Limit Response

When rate limit is exceeded, the server returns:

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

HTTP Status: `429 Too Many Requests`

## Monitoring

The server logs all requests with IP information:

```
[RATE LIMIT] Request from IP: 192.168.1.50
[WHITELIST] Request from whitelisted IP: 127.0.0.1
```

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use strong API keys** - Rotate them regularly
3. **Set appropriate rate limits** - Balance between usability and protection
4. **Whitelist sparingly** - Only trusted IPs should bypass limits
5. **Use HTTPS in production** - Encrypt data in transit
6. **Monitor logs** - Watch for suspicious patterns

## Production Deployment

### Docker Example

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npm run build:server
EXPOSE 3001
CMD ["npm", "run", "start:server"]
```

### Environment Variables

In production, use environment variables instead of `.env.local`:

```bash
export GEMINI_API_KEY="your_key"
export PORT=3001
export RATE_LIMIT_WINDOW_MS=900000
export RATE_LIMIT_MAX_REQUESTS=10
export WHITELISTED_IPS="10.0.0.5,10.0.0.6"
```

## Troubleshooting

### "Rate limit exceeded" Error

**Cause**: Too many requests from your IP
**Solution**: 
- Wait for the time window to reset
- Add your IP to `WHITELISTED_IPS`
- Increase `RATE_LIMIT_MAX_REQUESTS`

### "API Key is not configured" Error

**Cause**: Missing or invalid `GEMINI_API_KEY`
**Solution**: 
- Check `.env.local` exists
- Verify API key is correct
- Restart the server after changing env variables

### Server Not Starting

**Cause**: Port already in use or missing dependencies
**Solution**:
```bash
# Kill process on port 3001
npx kill-port 3001

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Client Can't Connect to Server

**Cause**: Incorrect `VITE_API_URL` or server not running
**Solution**:
- Verify server is running on correct port
- Check `VITE_API_URL` in `.env.local`
- Ensure no firewall blocking

## Advanced Configuration

### Custom Rate Limiter

Edit `server.ts` to customize rate limiting logic:

```typescript
const createRateLimiter = () => {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    // Add custom logic here
    handler: (req, res) => {
      res.status(429).json({
        error: 'Custom rate limit message',
        ip: req.ip,
        retryAfter: RATE_LIMIT_WINDOW_MS / 1000,
      });
    },
  });
};
```

### IP Detection Behind Proxies

If deployed behind a proxy/load balancer, the server automatically checks:
- `x-forwarded-for` header
- `x-real-ip` header
- Socket remote address

Ensure your proxy forwards these headers correctly.

## Support

For issues or questions:
1. Check server logs
2. Verify environment variables
3. Test with `/health` endpoint
4. Review this documentation

## License

Same as Q Panda Studio project license.

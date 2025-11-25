# Deployment Guide - Vercel & Netlify

Q Panda Studio can be deployed to Vercel or Netlify's **free tier** using serverless functions instead of a traditional Express server.

## 🎯 Quick Comparison

| Feature | Vercel | Netlify | Express Server |
|---------|--------|---------|----------------|
| **Free Tier** | ✅ Yes | ✅ Yes | ❌ Requires always-on hosting |
| **Rate Limiting** | ✅ Serverless functions | ✅ Serverless functions | ✅ Express middleware |
| **Cold Starts** | ~100-500ms | ~100-500ms | ❌ None (always warm) |
| **Persistence** | ❌ In-memory (resets) | ❌ In-memory (resets) | ✅ Can use Redis |
| **Setup** | ⚡ 1-click | ⚡ 1-click | 🔧 Manual |
| **Best For** | Side projects | Side projects | Production apps |

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Configure Environment Variables

In your Vercel project dashboard, add:
```
GEMINI_API_KEY=your_gemini_api_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
WHITELISTED_IPS=
```

### Step 3: Deploy

**Option A: Via CLI**
```bash
vercel
```

**Option B: Via GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Vite configuration
5. Add environment variables
6. Deploy! 🎉

### Step 4: Update Frontend Config

After deployment, update `.env.local`:
```env
VITE_USE_API_PROXY=true
VITE_API_URL=https://your-app.vercel.app
```

### How It Works

Vercel automatically routes requests from `/api/*` to serverless functions in the `api/` folder:
- `api/generate-content.ts` → `/api/generate-content`
- `api/generate-images.ts` → `/api/generate-images`

Each function:
- Runs independently (serverless)
- Has 60-second timeout (configurable)
- Includes rate limiting with in-memory store
- Resets on cold starts (acceptable for free tier)

---

## 🌊 Deploy to Netlify

### Step 1: Install Netlify CLI (Optional)
```bash
npm i -g netlify-cli
```

### Step 2: Configure Environment Variables

In Netlify dashboard, add:
```
GEMINI_API_KEY=your_gemini_api_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
WHITELISTED_IPS=
```

### Step 3: Deploy

**Option A: Via CLI**
```bash
netlify deploy --prod
```

**Option B: Via Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Netlify auto-detects build settings
6. Add environment variables
7. Deploy! 🎉

### Step 4: Update Frontend Config

After deployment:
```env
VITE_USE_API_PROXY=true
VITE_API_URL=https://your-app.netlify.app
```

### How It Works

Netlify routes `/api/*` to functions in `netlify/functions/`:
- `netlify/functions/generate-content.ts` → `/.netlify/functions/generate-content`
- Redirect rule in `netlify.toml` maps `/api/*` → `/.netlify/functions/*`

---

## 🔄 Rate Limiting on Serverless

### ⚠️ Important Limitations

**In-Memory Store (Default Implementation):**
- Rate limit data stored in function memory
- Resets on cold starts (~5-15 min of inactivity)
- Each function instance has its own memory
- Not shared across multiple instances

**What This Means:**
- ✅ **YES, it tracks IPs and enforces limits**
- ✅ Great for preventing abuse spikes (100 requests/min)
- ✅ Stops accidental infinite loops
- ✅ Works well for personal/small projects
- ⚠️ Counter resets after 15 min inactivity
- ⚠️ May allow slightly more requests during cold starts
- ❌ Can't enforce strict "X requests per lifetime" limits

**Real-World Impact:**
For 95% of use cases, this is **perfectly fine**. It prevents:
- Accidental runaway scripts
- Basic DoS attempts  
- API quota exhaustion from bugs

It won't prevent:
- Determined attacker who waits 15 min between bursts
- Strict compliance requirements (e.g., banking apps)

### 🎯 For Stricter Rate Limiting

If you need **persistent rate limiting** that survives cold starts:

#### **Option 1: Vercel KV** (Recommended for Vercel)
**Cost:** Free tier includes 3,000 commands/day

```bash
# Setup
npm install @vercel/kv
vercel env add KV_URL
vercel env add KV_REST_API_TOKEN
```

See `api/generate-content-with-kv.ts.example` for complete implementation.

**Pros:**
- ✅ Fully persistent (survives cold starts)
- ✅ Shared across all function instances
- ✅ Free tier usually sufficient
- ✅ Native Vercel integration

**Cons:**
- 💰 Paid plans needed for high traffic
- 🔒 Vercel-only (not portable)

#### **Option 2: Upstash Redis** (Works everywhere)
**Cost:** Free tier includes 10,000 commands/day

```bash
npm install @upstash/redis
```

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const key = `ratelimit:${ip}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 900); // 15 minutes
```

**Pros:**
- ✅ Works on Vercel, Netlify, anywhere
- ✅ More generous free tier
- ✅ Portable across platforms

**Cons:**
- 🔧 External service dependency

#### **Option 3: Netlify Blobs** (Netlify only)
```typescript
import { getStore } from '@netlify/blobs';

const store = getStore('ratelimit');
// Use blob store for persistence
```

**Pros:**
- ✅ Native Netlify integration

**Cons:**
- ⚠️ Beta feature
- 🔒 Netlify-only

---

### 📊 **Quick Comparison**

| Solution | Persistent? | Free Tier | Works On | Best For |
|----------|-------------|-----------|----------|----------|
| **In-Memory** | ❌ | ✅ Unlimited | All | Personal projects |
| **Vercel KV** | ✅ | ✅ 3k/day | Vercel | Vercel deployments |
| **Upstash Redis** | ✅ | ✅ 10k/day | All | Production apps |
| **Netlify Blobs** | ✅ | ✅ | Netlify | Netlify deployments |

---

## 📝 Deployment Checklist

### Before Deploying:

- [ ] Set `VITE_USE_API_PROXY=true` in environment
- [ ] Add `GEMINI_API_KEY` to platform environment variables
- [ ] Configure rate limit settings (window, max requests)
- [ ] Add whitelisted IPs if needed
- [ ] Test locally with `npm run dev:full`
- [ ] Commit and push to Git

### After Deploying:

- [ ] Update `VITE_API_URL` to your deployed URL
- [ ] Test all features (SceneShift, MemeSmith, etc.)
- [ ] Verify rate limiting works (exceed limit intentionally)
- [ ] Check function logs for errors
- [ ] Monitor usage/costs

---

## 🐛 Troubleshooting

### Functions Timing Out

**Vercel:**
Update `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

**Netlify:**
Functions have 10s timeout on free tier. Upgrade for longer timeouts.

### CORS Errors

Ensure headers are set correctly in function responses:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Rate Limit Not Working

Check:
1. Environment variables are set correctly
2. Client IP detection (check function logs)
3. Cold start reset behavior (expected)

### 500 Internal Server Error

Check function logs:
- **Vercel:** Dashboard → Functions → View logs
- **Netlify:** Dashboard → Functions → View logs

Common causes:
- Missing `GEMINI_API_KEY`
- Invalid API key
- Gemini API quota exceeded

---

## 💰 Cost Estimates (Free Tier)

### Vercel Free Tier:
- 100GB bandwidth/month
- 100 function invocations/day
- Serverless functions included
- **Perfect for side projects**

### Netlify Free Tier:
- 100GB bandwidth/month
- 125k function invocations/month
- 300 build minutes/month
- **Great for portfolios**

### When to Upgrade:

If you exceed:
- 1,000+ daily users
- 10,000+ API calls/month
- Need persistent rate limiting
- Want better cold start performance

Consider upgrading or using dedicated hosting with Express server.

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Set reasonable rate limits** - Balance usability and protection
3. **Monitor function logs** - Watch for abuse patterns
4. **Use HTTPS** - Both platforms provide free SSL
5. **Rotate API keys** - Periodically change keys
6. **Whitelist carefully** - Only trusted IPs

---

## 🎓 Advanced: Hybrid Approach

For the best of both worlds:

**Free tier for frontend:**
- Deploy React app on Vercel/Netlify
- Host static assets on CDN

**Paid tier for API:**
- Deploy Express server on Railway/Render/Fly.io ($5-10/month)
- Use Redis for persistent rate limiting
- Better control and monitoring

Update `VITE_API_URL` to point to your Express server.

---

## ❓ FAQ

### Does rate limiting work on Vercel free tier?
**YES!** The serverless functions track IPs and enforce rate limits. The only caveat is that counters reset after ~15 minutes of inactivity (cold starts). For most projects, this is totally fine.

### Will rate limits survive server restarts?
- **In-Memory (default):** ❌ Resets on cold starts
- **With Vercel KV/Upstash:** ✅ Fully persistent

### Can a user bypass rate limits?
With in-memory storage, a determined user could wait 15 minutes between bursts. For stricter enforcement, use Vercel KV or Upstash Redis.

### How much does this cost on Vercel free tier?
**$0** for basic features. Vercel free tier includes:
- 100GB bandwidth
- Serverless functions
- Automatic scaling

If you add Vercel KV, it's still free for up to 3,000 commands/day.

### What happens during high traffic?
Vercel auto-scales serverless functions. Each instance has its own rate limit counter, so limits might be slightly higher during scale-up. This is usually acceptable.

### Is this secure enough for production?
- **Personal/small projects:** ✅ Yes, default setup is fine
- **Medium apps:** ✅ Add Vercel KV for persistence  
- **Enterprise/critical apps:** Consider dedicated servers with advanced rate limiting

### Can I use Redis for better rate limiting?
Yes! Use Upstash Redis (free tier) or Vercel KV for persistent rate limiting. See examples above.

---

## 📚 Additional Resources

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Upstash Redis](https://upstash.com/)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Rate Limiting Best Practices](https://vercel.com/guides/rate-limiting)

---

## ✅ Summary

✨ **For Most Users:**
- Deploy on Vercel or Netlify free tier
- Use serverless functions with in-memory rate limiting
- Accept minor rate limit resets on cold starts
- Perfect for personal projects and portfolios

🚀 **For Production:**
- Use dedicated server (Railway, Render, Fly.io)
- Implement Redis-based rate limiting
- Get persistent storage and better performance
- Worth it for serious applications

Choose based on your needs! 🎯

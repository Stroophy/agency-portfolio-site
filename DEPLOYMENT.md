# Deployment & Setup Guide

## 🚀 Current Status

### ✅ Completed
1. **Repository**: Created at `Stroophy/agency-portfolio-site`
2. **Next.js App**: Professional portfolio site built with:
   - Next.js 15 (App Router)
   - TypeScript
   - Tailwind CSS v4
   - Lucide React icons
   - Prettier for code formatting
3. **Vercel**: Configured (PI-HUB already deployed)
4. **Build**: Production build successful
5. **Code**: Pushed to GitHub main branch

### 🔄 In Progress
1. **GitHub Organization**: "PI-HUB-Web" - Need to create
2. **Supabase**: Backend setup required
3. **Cloudflare**: DNS and CDN setup
4. **Tailscale Exit Node**: Network setup

## 📋 GitHub Organization Creation

### Option 1: Web Interface (Recommended)
1. Go to https://github.com/account/organizations/new
2. Log in with your GitHub account
3. Fill in organization details:
   - Organization name: `PI-HUB-Web`
   - Billing email: `isurum.aus@gmail.com`
   - Plan: Free (start with Free, upgrade later if needed)

### Option 2: API (If available)
If you have GitHub Pro or meet requirements:
```bash
# Check if organization creation is available via API
curl -X POST https://api.github.com/user/orgs \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "login": "PI-HUB-Web",
    "name": "PI-HUB Web Services",
    "description": "Melbourne-based website development agency",
    "company": "PI-HUB Web Services",
    "billing_email": "isurum.aus@gmail.com"
  }'
```

### Option 3: Transfer Repository Later
If organization creation is delayed:
1. Keep repository under `Stroophy/agency-portfolio-site` for now
2. Transfer to organization once created:
   - Settings → Transfer ownership
   - Select "PI-HUB-Web" organization

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Sign up/login with GitHub
3. Create new project:
   - Name: `pihub-web-services`
   - Database password: [Generate secure password]
   - Region: Choose closest to Melbourne (Australia Southeast)
   - Pricing: Start with Free tier

### Step 2: Get Connection Details
After project creation:
1. Go to Project Settings → Database
2. Copy:
   - Project URL
   - Anon/public key
   - Service role key (keep secure)

### Step 3: Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ☁️ Cloudflare Setup

### Step 1: Add Domain
1. Sign up at https://cloudflare.com
2. Add your domain (e.g., `pihubwebservices.com`)
3. Update nameservers as instructed

### Step 2: Configure DNS
1. Add A record pointing to Vercel IP
2. Add CNAME for www subdomain
3. Enable proxy (orange cloud) for DDoS protection

### Step 3: Performance Settings
1. Enable Auto Minify
2. Enable Brotli compression
3. Configure caching rules
4. Enable HTTP/3

## 🖥️ Vercel Deployment

### Automatic Deployment
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Environment Variables
Add in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Custom Domain
1. In Vercel, go to Domains
2. Add your domain (e.g., `pihubwebservices.com`)
3. Follow verification steps

## 🔗 Tailscale Exit Node

### On Oracle ARM Server
```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale
sudo tailscale up --advertise-exit-node

# Make exit node permanent
sudo tailscale up --advertise-exit-node --reset
```

### On Client Devices
```bash
# Connect to exit node
tailscale up --exit-node=100.xx.xx.xx
```

## 📊 Next Steps

### Immediate (Today)
1. ✅ Complete portfolio site development
2. ✅ Push code to GitHub
3. 🔄 Create GitHub organization
4. ⬜ Set up Supabase project
5. ⬜ Configure Vercel deployment

### Short-term (This Week)
1. Purchase domain (e.g., pihubwebservices.com)
2. Set up Cloudflare
3. Configure email (contact@pihubwebservices.com)
4. Add more portfolio projects
5. Implement contact form with Supabase

### Long-term (Next Month)
1. Add client dashboard
2. Implement booking system
3. Add blog/content section
4. Set up analytics
5. Create case studies

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Format code
npm run format

# Deploy to Vercel
vercel --prod
```

## 📞 Support

For issues with:
- **GitHub Organization**: Contact GitHub Support
- **Supabase**: Check Supabase Discord
- **Vercel**: Vercel Support Docs
- **Cloudflare**: Cloudflare Community

## 📄 License

This project is proprietary to PI-HUB Web Services.
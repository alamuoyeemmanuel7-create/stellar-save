# 🚀 Deployment Checklist

## Pre-Deployment (5 minutes)

- [ ] Commit all changes to GitHub
  ```bash
  git add .
  git commit -m "Production: landing page + demo + onboarding"
  git push origin main
  ```

- [ ] Verify build locally
  ```bash
  cd apps/web
  npm run build
  ```

## Deploy to Vercel (2 minutes)

1. Go to **https://vercel.com/new**
2. Select your GitHub repo
3. **Root Directory:** `apps/web`
4. **Build Command:** `npm install && npm run build`
5. **Output Directory:** `.next`
6. Click **Deploy**

## Post-Deployment (3 minutes)

### Add Environment Variables (in Vercel dashboard)

For **live demo** (no real contract needed):
- `NEXT_PUBLIC_SOROBAN_RPC_URL` = `https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_NETWORK_PASSPHRASE` = `Test SDF Network ; September 2015`
- `NEXT_PUBLIC_CONTRACT_ID` = `CBQH...` (can be dummy for now)
- `NEXT_PUBLIC_SETTLEMENT_TOKEN` = `CBQH...` (can be dummy for now)

### Add Custom Domain (Optional)

1. In Vercel: **Settings → Domains**
2. Enter your domain (e.g., `stellarsave.io`)
3. Update DNS with Vercel's nameservers
4. Done! HTTPS automatic.

## What's Live

✅ **Landing Page** — https://YOUR_DOMAIN  
✅ **Interactive Demo** — https://YOUR_DOMAIN/demo  
✅ **Onboarding** — Triggers on first visit to `/groups`  
✅ **Analytics** — Automatic Vercel tracking  

## Next Steps

1. **Record demo video** (60 sec screen recording)
2. **Share on social media**
3. **Get feedback from early users**
4. **Track analytics**

---

## Troubleshooting

**Build fails?**
- Check Node version: `node --version` (should be 18+)
- Clear cache: Delete `.next` folder
- Reinstall: `npm install`

**Blank page?**
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs

**Demo doesn't work?**
- Clear browser cache (`Ctrl+Shift+Del`)
- Try incognito mode
- Check `/demo` path exists

---

## Sharing Your Live App

**Landing:** Share this link with investors  
**Demo:** Link to `/demo` for interactive walkthrough  
**GitHub:** Link to repo for credibility  

---

## Analytics to Monitor

Once live, watch:
- **Visitors** — Landing page traffic
- **Demo completions** — How many people finish the walkthrough
- **CTA clicks** — "Start Saving" button conversions
- **Time on page** — Engagement metric
- **Bounce rate** — Is the value proposition clear?

---

**Status:** Ready to deploy ✅

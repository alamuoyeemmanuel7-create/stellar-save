# Deploy StellarSave to Vercel in 2 Minutes

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: StellarSave MVP"
git remote add origin https://github.com/YOUR_USERNAME/stellar-save.git
git branch -M main
git push -u origin main
```

## 2. Connect to Vercel

Go to **https://vercel.com/new** and:
- Select your GitHub repo
- Set project name to "stellar-save"
- Set root directory to `apps/web`

## 3. Add Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_CONTRACT_ID=<YOUR_CONTRACT_ID>
NEXT_PUBLIC_SETTLEMENT_TOKEN=<YOUR_USDC_ADDRESS>
```

## 4. Deploy

Click "Deploy" — Vercel auto-deploys every git push.

## 5. Custom Domain (Optional)

In Vercel: Settings → Domains → Add your domain (DNS setup required)

**Result:** Live at https://stellar-save.vercel.app (or your domain)

---

## Troubleshooting

**Build fails?** Check:
- [ ] Node.js 18+
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] No `.env.local` committed

**Runtime errors?** Check:
- [ ] Contract ID is correct
- [ ] RPC URL is accessible
- [ ] USDC token address is valid

---

## What's Live

✅ Landing page (SEO optimized)  
✅ Onboarding flow (first-time users)  
✅ App dashboard (create/join groups)  
✅ Analytics (Vercel auto-tracking)  
✅ Responsive design (mobile-first)  

---

## Next: Record Demo Video

**Quick script:**
1. Connect wallet (2 sec)
2. Create group (5 sec)
3. Show group details (3 sec)
4. Explain smart contracts (10 sec)

**Upload to YouTube with description linking to app.**

Total: ~1 min video that shows everything.

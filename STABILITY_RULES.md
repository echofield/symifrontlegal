# Code Stability Rules — Symione

## 🎯 Core Principle
**Never break production.** Test locally, commit cleanly, deploy backend-first.

---

## ✅ Before Any Change

1. **Check what's deployed:**
   - Frontend: https://www.symione.com
   - Backend: https://api.symione.com/api/health

2. **Read deployment logs:**
   - Backend: Vercel → symilegalback project
   - Frontend: Vercel → symionefront project

3. **Verify environment variables exist:**
   - Frontend: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Backend: `OPENAI_API_KEY`, `OPENAI_MODEL`, `TESTING_MODE`, `FRONTEND_URL`, `CORS_ORIGIN`

---

## 🔒 Never Touch These

### Critical Files (Don't modify without understanding impact):
- `vercel.json` (root) — Build configuration
- `package.json` (symione/) — Vite build scripts
- `.vercelignore` — Deployment isolation
- Environment variables in Vercel UI

### Critical Endpoints (Always test after changes):
- `/api/generate` — Contract generation
- `/api/conseiller/analyze` — Legal advisor
- `/api/health` — System health check

### Critical Categories (Keep stable):
- **Contracts**: Prestation, Travaux, Création, Événementiel (4 types only)
- **Lawyer specialties**: Droit des contrats, Droit du travail, Droit commercial, etc.
- **Pricing**: Documents €119, Bond €149+3%, Cabinet €350
- **Plan limits**: Anonymous 2 contracts, Free unlimited, Pro unlimited

---

## 📝 Making Safe Changes

### Backend Changes

```bash
# 1. Create branch
git checkout -b feature/improve-conseiller

# 2. Make changes
# Edit files in symilegalback-main/

# 3. Test API locally (if possible)
# Or test in production after deploy

# 4. Commit
git add .
git commit -m "feat: improve conseiller audit categories"

# 5. Push (auto-deploys to Vercel)
git push origin feature/improve-conseiller

# 6. Wait 2 minutes, verify:
curl https://api.symione.com/api/health
# Expected: {"status":"healthy"...}

# 7. If broken, instant rollback in Vercel
```

### Frontend Changes

```bash
# 1. Create branch
git checkout -b feature/fix-advice-display

# 2. Make changes
# Edit files in symione/

# 3. Build locally (optional)
cd symione
npm run build

# 4. Commit
git add .
git commit -m "fix: improve advice display"

# 5. Push (auto-deploys)
git push origin feature/fix-advice-display

# 6. Wait 2 minutes, verify:
# Visit https://www.symione.com
# Check browser console (F12)
# No errors = success
```

---

## ⚠️ Breaking Change Rules

If you modify:
- **API endpoint URLs** → Update frontend calls immediately
- **Environment variables** → Add in Vercel UI before redeploy
- **Database schema** → Create migrations, run on deploy
- **Authentication flow** → Test login/signup end-to-end
- **Payment flows** → Test with Stripe test mode first

---

## 🚨 Rollback Protocol

**If deployment fails or site breaks:**

1. **Immediate fix:**
   ```bash
   # In Vercel dashboard:
   # 1. Open broken deployment
   # 2. Click "Instant Rollback"
   # 3. Confirm
   # 4. Verify site works
   ```

2. **Then fix code:**
   ```bash
   git checkout main  # or stable branch
   git pull
   # Fix the bug
   git commit -m "hotfix: revert X, fixed with Y"
   git push
   ```

---

## 🔍 Quick Health Checks

After every deployment:

```
✅ Backend health: curl https://api.symione.com/api/health
   Expected: {"status":"healthy"}

✅ Frontend loads: https://www.symione.com
   Expected: White UI, no console errors

✅ Check Vercel logs for errors
   Backend: vercel.com/projects/symilegalback → Logs
   Frontend: vercel.com/projects/symionefront → Logs
```

---

## 💡 Current Stable State

**Frontend:** symione/ (Vite)
- Framework: Vite React
- Deployed at: www.symione.com
- Env vars: VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

**Backend:** symilegalback-main/ (Next.js API)
- Deployed at: api.symione.com
- Env vars: OPENAI_API_KEY, OPENAI_MODEL, TESTING_MODE, FRONTEND_URL, CORS_ORIGIN

**Working features:**
- ✅ Contract generation (Documents €119)
- ✅ Bond creation (€149 + 3%)
- ✅ Conseiller advisor (audit + templates)
- ✅ Supabase auth
- ✅ Stripe payment (testing mode)

**Known issues (acceptable):**
- No lawyer recommendations (needs Perplexity API key)
- Conseiller audit can be improved

---

## 🛡️ Stability Checklist

Before committing:
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] Environment variables present
- [ ] Breaking changes documented
- [ ] Test endpoints manually (if API changes)

After deploying:
- [ ] Health check passes
- [ ] Frontend loads without errors
- [ ] Console shows no 500s
- [ ] Existing features still work
- [ ] New feature works end-to-end

If any fail:
- [ ] Rollback immediately
- [ ] Fix locally
- [ ] Redeploy
- [ ] Verify again

---

## 📊 What to Monitor

**Vercel logs show:**
- 200 OK = Good
- 500/503 = Backend error (check logs)
- 405 = Method not allowed (check endpoint)
- CORS errors = Domain mismatch (check env vars)

**Frontend console shows:**
- Failed to fetch = Backend down or wrong URL
- 401 Unauthorized = Auth token missing
- 403 Forbidden = Permissions issue

---

## 🎯 Summary

**Safe to change:**
- UI components, styling, text
- API business logic
- Database queries
- New features

**Never change without testing:**
- Build configuration
- Domain mappings
- Environment variables
- Authentication flows
- Payment flows

**Always:**
- Test locally first
- Deploy backend before frontend
- Monitor logs
- Keep rollback ready

---

*Last updated: After stable production deployment (Oct 27, 2025)*


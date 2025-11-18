# Deployment Guide — RIC Site

Production = `main` branch.

---

## 1. Deploy

Push to main:

git add .
git commit -m “”
git push origin main

Vercel builds automatically:
- install deps
- next build
- deploy serverless functions
- swap production pointer

---

## 2. Rollback

Vercel → Deployments → pick any successful deployment → “Promote to Production”.

Instant.

---

## 3. Environment Variables

Location:  
Vercel → Project → Settings → Environment Variables

Required:
- `RIC_URL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`

Optional:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

No `.env.local` is deployed.

---

## 4. Substrate Update Procedure

SSH into server:

cd /opt/ric-core-2
git pull
pnpm install
systemctl restart ric-api

Verify:

curl http://localhost:8787/healthz
curl http://localhost:8787/metrics

---

## 5. Version Tags

git tag v0.1.0-demo-docs
git push origin v0.1.0-demo-docs
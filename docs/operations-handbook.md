# RIC Site — Operations Handbook (v0.1.0)

Stable operations for the public RIC demo.

---

## 1. Production Deployment Rule

Production = `main` branch.

Pushing to `main` triggers an automatic deploy on Vercel.

---

## 2. Pre-Deploy Checklist

Before pushing:

```bash
pnpm lint
pnpm build

Check:
	•	/demo
	•	/bundle/<id>
	•	/stem
	•	/legality-demo
	•	/ric-stem

RIC substrate:
	•	/healthz
	•	/metrics

⸻

3. Environment Variables

All managed in Vercel → Settings → Environment Variables.

Required:
	•	RIC_URL
	•	ANTHROPIC_API_KEY
	•	ANTHROPIC_MODEL

Optional:
	•	OPENAI_API_KEY
	•	OPENAI_MODEL

No .env files are committed.

⸻

4. RIC Substrate Maintenance

Server location: your DigitalOcean machine
Service: ric-api.service

Commands:

systemctl status ric-api
systemctl restart ric-api
journalctl -u ric-api -f

API endpoints:
	•	/run
	•	/bundle/:id
	•	/metrics
	•	/healthz

⸻

5. Rollback Procedure

Vercel → Deployments → select previous deployment → “Promote to Production”.

⸻

6. Version Tagging

For each milestone:

git tag v0.x.y
git push origin v0.x.y

Tags match substrate + site snapshot.

⸻

7. Adding New Demos
	1.	Add page under app/<route>/page.tsx.
	2.	Add API route under app/api/<route>/route.ts.
	3.	All RIC calls must go through the API route.
	4.	Document endpoints under /docs.

⸻

8. Observability

Check:

8.1 RIC metrics

Go to: RIC_URL/metrics

8.2 Vercel logs

Project → Logs → Runtime logs for API routes.

⸻

9. Security

Already active:
	•	Build Logs & Source Protection
	•	Git Fork Protection

No further action required.
Password protection is optional and not needed.

⸻

10. Planned Extensions
	•	Full RIC-STEM solver
	•	Multi-run legality dashboard
	•	Model compliance audit viewer
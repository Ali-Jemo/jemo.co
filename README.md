# Jemo.co

هذا الموقع مفتوح المصدر للجميع لاستخدامه وتحسينه تماشياً مع سياسات الشركة.
أي شيء تطوروه أو تحسنوه في الموقع، يرجى رفعه (Pull Request) وسيتم الموافقة عليه ورفعه مباشرة.

---

This website is open-source for everyone to use and improve in alignment with the company's policies. Any developments or improvements you make can be submitted via Pull Request and will be reviewed and merged.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The public origin is [https://lab.jemo.dev](https://lab.jemo.dev). Override it with `NEXT_PUBLIC_SITE_URL` (this value is inlined at build time and drives `metadataBase`, canonical links, the sitemap, `robots.txt`, and JSON-LD).

## Production environment

Copy `.env.example`. Do not commit real secrets. Values prefixed `NEXT_PUBLIC_` are baked into the client bundle, so they must be present **during the build**, not only as a Wrangler secret.

| Variable | When | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Canonical origin. Default `https://lab.jemo.dev`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` or `CONTACT_EMAIL` | build for the public UI | Inbox. Default `contact@jemo.dev`. |
| `NEXT_PUBLIC_PRIVACY_EMAIL` / `PRIVACY_EMAIL` | build | Privacy inbox. Falls back to the contact address. |
| `NEXT_PUBLIC_LEGAL_EMAIL` / `LEGAL_EMAIL` | build | Legal inbox. Falls back to the contact address. |
| `NEXT_PUBLIC_SOCIAL_LINKS` | build | JSON array of `{id,href,label}`. Default Telegram + GitHub. |
| `NEXT_PUBLIC_SHOW_UNVERIFIED_SAMPLES` | build | `1` shows sample papers and news in production. Default hidden. |
| `JEMO_LIVE_CONTENT` | build | `1` overlays Supabase content onto static pages. Leave unset to render committed defaults. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **build** | Clerk publishable key. A Worker secret alone leaves the client key empty. |
| `CLERK_SECRET_KEY` | runtime secret | `wrangler secret put CLERK_SECRET_KEY`. |
| `CLERK_FRONTEND_API` | build or runtime | Production Clerk Frontend API origin for CSP. `*.clerk.accounts.dev` is not enough for production. |
| `NEXT_PUBLIC_SUPABASE_URL` | build | Browser Supabase URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build | Browser anon key. Without it the dashboard does not wait on Supabase. |
| `SUPABASE_URL` | runtime | Server Supabase URL. |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | runtime secret | Service role. Never prefix it `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` and `EMAIL_FROM` | runtime secret | Deliver `/api/contact`. Without them the form cannot send mail; `mailto:contact@jemo.dev` still works. |

Cloudflare dashboard (not in this repo): remove any response-header transform that repeats the headers set in `src/proxy.ts`, and enable **Always Use HTTPS**. The Worker redirects only when `x-forwarded-proto` is `http`.

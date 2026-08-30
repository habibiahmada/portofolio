# Terminal portfolio (npx & SSH)

Public commands shown on the website hero and floating widget:

```bash
npx habibiahmada
ssh ssh.habibiahmada.dev
```

Both launch the same Go/Bubble Tea portfolio TUI. `npx` runs locally; SSH runs on AWS EC2 via [Wish](https://github.com/charmbracelet/wish).

## Why `ssh.habibiahmada.dev` (not the apex domain)

| Host | Role | SSH on port 22 |
|------|------|----------------|
| `habibiahmada.dev` | Website (Cloudflare → Vercel) | No — proxied through Cloudflare |
| `ssh.habibiahmada.dev` | Portfolio SSH (EC2) | Yes — direct A record to EC2 |

The apex domain cannot serve HTTPS on Vercel and public SSH on EC2 at the same time on Cloudflare’s free plan. A dedicated subdomain keeps the website unchanged.

## DNS (Cloudflare)

Add one record in the `habibiahmada.dev` zone:

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| A | `ssh` | EC2 public IP (`52.55.210.120`) | **DNS only** (grey cloud) |

Verify:

```bash
dig +short ssh.habibiahmada.dev A
# Must return the EC2 IP, not 104.x / 172.x (Cloudflare proxy)

ssh ssh.habibiahmada.dev
# Opens the portfolio TUI (no username required)
```

## Availability

SSH shares the EC2 instance with the Telegram agent hub. The instance may be stopped outside scheduled windows. If SSH fails to connect, use `npx habibiahmada` instead.

## Related repos & docs

| Resource | Location |
|----------|----------|
| Terminal source | `habibiahmada/portofolio-terminal` |
| npm package | `habibiahmada@0.0.2` on npm |
| Deploy & DNS details | terminal repo `docs/deployment.md` |
| User guide | terminal repo `docs/user-guide.md` |

## Website integration

- Hero copy: `components/sections/hero.tsx`
- Floating widget: `components/ui/terminal-shell-widget.tsx`
- Loaded on all public pages via `app/(public)/layout.tsx`

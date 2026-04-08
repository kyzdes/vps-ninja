# Context Map — VPS Ninja

Quick-orientation document for after context reset. Covers what's where, how things connect, and non-obvious details.

---

## Project identity

**VPS Ninja v3.1** — Claude Code Skill for automating VPS server management through Dokploy (self-hosted PaaS), CloudFlare DNS, and SSH. One-command deploy from GitHub to a running app with SSL and auto-deploy on push.

**Owner:** kyzdes (single user, private skill)
**Install path:** `~/.claude/skills/vps/`
**Repo:** `/Users/viacheslavkuznetsov/Desktop/Projects/VPS-NINJA/`

---

## Directory structure

```
VPS-NINJA/
├── SKILL.md                 # Main skill — frontmatter + command routing + inline commands
├── README.md                # User-facing docs, quick start, commands table
├── PRD.md                   # Product requirements, architecture, all commands spec
├── CHANGELOG.md             # v1.0 → v2.0 → v3.0 → v3.1.0 → v3.1.1
├── fixed-errors.md          # 9 production bugs: symptoms, root cause, solutions
├── context-map.md           # This file
├── .gitignore               # Excludes config/servers.json, node_modules, .DS_Store
│
├── scripts/                 # Shell wrappers (deterministic, retryable)
│   ├── dokploy-api.sh       # Dokploy tRPC API client
│   ├── cloudflare-dns.sh    # CloudFlare DNS API client
│   ├── ssh-exec.sh          # SSH command executor (normal/bg/poll modes)
│   └── wait-ready.sh        # URL health checker
│
├── references/              # Detailed guides (loaded on demand by command)
│   ├── deploy-guide.md      # 3-phase deploy workflow, all API call sequences
│   ├── setup-guide.md       # 10-step VPS setup from scratch
│   ├── stack-detection.md   # Framework detection rules, 11 priorities
│   ├── dokploy-api-reference.md  # Full tRPC API reference (v0.27+)
│   ├── github-app-autodeploy.md  # GitHub App integration, no webhooks needed
│   ├── troubleshooting.md        # 8 categories of common issues + rollback
│   └── manual-docker-deploy.md   # Fallback deploy without GitHub access
│
├── config/
│   ├── servers.json         # LIVE CREDENTIALS (gitignored, never expose)
│   ├── servers.json.example # Template with placeholder values
│   └── .gitignore           # Protects servers.json from commits
│
├── templates/
│   └── setup-server.sh      # VPS init script (firewall, swap, fail2ban, updates)
│
├── benchmarks/              # Eval results
│   ├── BENCHMARK.md         # 100% vs 25% pass rate analysis
│   ├── benchmark.json       # Raw metrics per test
│   ├── eval-viewer.html     # Interactive dashboard (open in browser)
│   ├── deploy-nextjs-app/   # Test case artifacts
│   ├── auto-deploy-troubleshoot/
│   └── setup-vps/
│
├── evals/
│   └── evals.json           # 3 eval definitions with assertion sets
│
├── mcp-server/              # Optional MCP server for Dokploy docs
│   ├── index.js             # 3 tools: dokploy_api_reference, dokploy_guide, dokploy_search
│   ├── package.json         # Depends on @modelcontextprotocol/sdk@^1.12.0
│   ├── docs/                # Bundled Dokploy documentation
│   └── scripts/fetch-docs.js
│
└── landing/                 # Marketing website (separate Next.js app)
    ├── package.json         # Next.js 16, React 19, Tailwind 4, Framer Motion, GSAP
    ├── src/app/page.tsx     # Hero, Terminal, Features, Benchmarks, Setup, Security
    └── src/components/      # EvolutionTimeline, BenchmarksSection, SetupWorkflow, etc.
```

---

## SKILL.md — The brain

### Frontmatter
```yaml
name: vps
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Glob, Grep, WebFetch, Agent
argument-hint: "[setup|deploy|domain|db|status|logs|destroy|config] [args...]"
```

### Command routing
| Command | Loads references | Inline logic |
|---------|-----------------|--------------|
| `setup` | setup-guide.md | No (follows guide) |
| `deploy` | deploy-guide.md + stack-detection.md | No (follows guide) |
| `domain` | — | Yes: add/remove/list subcommands |
| `db` | — | Yes: create/list/delete, requires environmentId |
| `status` | — | Yes: project.all + SSH resources, warns disk>80% RAM>90% |
| `logs` | — | Yes: SSH docker logs or build logs via logPath |
| `destroy` | — | Yes: confirmation → stop → delete app/db/dns/project |
| `config` | — | Yes: server add/remove, cloudflare token, default server |

### Critical architecture decisions in SKILL.md

**GitHub App integration (lines 40-97):**
- Check `gitProvider.getAll` for `providerType: "github"` first
- Use `githubId` (NOT `gitProviderId`) from the response
- Call `application.saveGithubProvider` with 8 required fields
- NEVER set `sourceType: "github"` without `saveGithubProvider` first → causes "Github Provider not found"

**4-tier deployment fallback (lines 99-117):**
1. GitHub App installed → `saveGithubProvider`
2. Repo accessible from server → `customGitUrl` with `sourceType: "git"`
3. User has PAT → `https://<PAT>@github.com/...`
4. Manual Docker build → see manual-docker-deploy.md

**Auto-deploy behavior:**
- GitHub App handles it automatically after first deploy — no webhooks, no GitHub Actions
- `autoDeploy` flag just enables/disables the behavior
- Never suggest webhook setup — this is the #1 mistake without the skill

---

## Scripts — calling conventions

### dokploy-api.sh
```bash
bash scripts/dokploy-api.sh [--extract <jq-path>] <server> <METHOD> <endpoint> [json-body]
```
- All mutations are **POST** (tRPC, never PUT/DELETE)
- Timeouts: 60s for mutations matching `update|deploy|save*|remove|delete`, 30s for reads
- Exit codes: 0=ok, 1=config error, 2=HTTP error, 3=network error, 4=invalid JSON
- Parses tRPC Zod `fieldErrors` for human-readable validation errors

### cloudflare-dns.sh
```bash
bash scripts/cloudflare-dns.sh create <domain> <ip> [--no-proxy]
bash scripts/cloudflare-dns.sh delete <domain>
bash scripts/cloudflare-dns.sh list <zone-domain>
bash scripts/cloudflare-dns.sh get <domain>
```
- `--no-proxy` / `false` / `no` → proxied=false (REQUIRED for Let's Encrypt)
- Multi-part TLD: probes API with progressively longer suffixes (handles `.co.uk`)
- CREATE upserts: uses PUT if record exists, POST if new
- Exit codes: 0=ok, 1=config error, 2=API error

### ssh-exec.sh
```bash
bash scripts/ssh-exec.sh <server> <command>                    # normal mode
bash scripts/ssh-exec.sh --password <pass> <ip> <command>      # password mode (setup)
bash scripts/ssh-exec.sh --bg <server> <command> [log-file]    # background mode
bash scripts/ssh-exec.sh --poll <server> <pattern> [log-file]  # poll mode
```
- Password passed via `SSHPASS` env var (not `-p` flag, not in `ps` output)
- `--bg` returns JSON: `{"status":"started","pid":"...","log_file":"..."}`
- `--poll` returns JSON: `{"status":"running"}` or `{"status":"done","log_tail":"..."}`
- `_escape_for_sh()` prevents command injection (single-quote escaping)
- SSH options: StrictHostKeyChecking=no, ConnectTimeout=10, ServerAliveInterval=15

### wait-ready.sh
```bash
bash scripts/wait-ready.sh <url> [timeout=120] [interval=5]
```
- Success: HTTP 200-499
- Returns JSON: `{"status":"ready","url":"...","http_code":200,"elapsed":15}`
- Timeout: `{"status":"timeout","url":"...","timeout":120}` to stderr, exit 1

---

## Dokploy API — critical field requirements

All endpoints prefixed with `/api/`. Base URL from `servers.json` → `dokploy_url`.

### Fields that MUST be complete (Zod schema enforced)

**`application.saveBuildType`** — 7 fields required:
```json
{
  "applicationId": "...",
  "buildType": "nixpacks",
  "dockerContextPath": "/",
  "dockerBuildStage": "",
  "dockerfile": "Dockerfile",
  "herokuVersion": "24",
  "railpackVersion": "0.15.4"
}
```

**`application.saveEnvironment`** — 5 fields required:
```json
{
  "applicationId": "...",
  "env": "KEY=value\nKEY2=value2",
  "buildArgs": "",
  "buildSecrets": "",
  "createEnvFile": true
}
```

**`application.saveGithubProvider`** — 8 fields:
```json
{
  "applicationId": "...",
  "owner": "...",
  "repository": "...",
  "branch": "main",
  "buildPath": "/",
  "githubId": "<from gitProvider.getAll>",
  "triggerType": "push",
  "enableSubmodules": false
}
```

**`application.create`** — requires `environmentId` (from `project.create` response):
```json
{
  "name": "...",
  "projectId": "...",
  "environmentId": "..."
}
```

**`domain.create`**:
```json
{
  "applicationId": "...",
  "host": "app.example.com",
  "port": 3000,
  "https": true,
  "path": "/",
  "certificateType": "letsencrypt"
}
```

**Docker Compose field name:** `composeFile` (NOT `customCompose` — silently ignored if wrong)

### Key endpoints
| Endpoint | Method | Notes |
|----------|--------|-------|
| `project.create` | POST | Returns `{project: {projectId}, environment: {environmentId}}` |
| `project.all` | GET | Full tree: projects → apps → databases → domains |
| `application.create` | POST | Needs `environmentId` |
| `application.update` | POST | For `sourceType`, `autoDeploy`, `customGitUrl` |
| `application.saveGithubProvider` | POST | GitHub App integration |
| `application.saveBuildType` | POST | All 7 fields |
| `application.saveEnvironment` | POST | All 5 fields |
| `application.deploy` | POST | Triggers build |
| `application.redeploy` | POST | Rebuild + restart |
| `gitProvider.getAll` | GET | Get `githubId` for saveGithubProvider |
| `domain.create` | POST | DNS must propagate BEFORE calling this |
| `deployment.all` | GET | `?applicationId=...` → includes `logPath` |
| `settings.version` | GET | Validate API key |

---

## Config file format (servers.json)

```json
{
  "servers": {
    "main": {
      "host": "45.55.67.89",
      "ssh_user": "root",
      "ssh_key": "",
      "dokploy_url": "http://45.55.67.89:3000",
      "dokploy_api_key": "dk_...",
      "github_provider_id": "",
      "added_at": "2026-02-17T12:00:00Z"
    }
  },
  "cloudflare": {
    "api_token": "..."
  },
  "defaults": {
    "server": "main"
  }
}
```

Scripts only read this file. Claude writes it via the Write tool. Gitignored.

---

## Deploy flow (end-to-end sequence)

```
1. Parse args: github URL, --domain, --branch, --server, --dry-run
2. Read config/servers.json → get server credentials
3. Clone repo (shallow) → detect stack (references/stack-detection.md)
4. Determine port, env vars, DB dependencies
5. Show analysis → ask user for secrets
6. POST project.create → get projectId + environmentId
7. If DB needed → POST postgres.create (etc.) → deploy → get connection string
8. Check gitProvider.getAll → decide deployment path (A/B/C/D)
   A: POST application.saveGithubProvider
   B: POST application.update {sourceType:"git", customGitUrl:...}
   C: POST application.update {customGitUrl:"https://<PAT>@github.com/..."}
   D: Manual Docker build on server
9. POST application.saveBuildType (7 fields)
10. POST application.saveEnvironment (5 fields, includes DB URL)
11. bash cloudflare-dns.sh create <domain> <ip> --no-proxy
12. Wait 30s for DNS propagation
13. POST domain.create {certificateType:"letsencrypt"}
14. POST application.deploy
15. Monitor logs via SSH (logPath from deployment.all)
16. bash wait-ready.sh https://<domain>
17. Report: success + "auto-deploy active, push to <branch> to redeploy"
```

---

## Stack detection priority

1. `docker-compose.yml` → Compose
2. `Dockerfile` → Docker
3. `next.config.*` → Next.js (check version → set NIXPACKS_NODE_VERSION if ≥15)
4. `nuxt.config.*` → Nuxt
5. `angular.json` → Angular
6. `package.json` → Node.js (detect framework from deps)
7. `requirements.txt` / `pyproject.toml` → Python
8. `go.mod` → Go
9. `Cargo.toml` → Rust
10. `Gemfile` → Ruby
11. `pom.xml` / `build.gradle` → Java

**Next.js special handling:** If next@15+ or next@16+ detected and no `.nvmrc` or `engines` field → create `.nvmrc` with `20` and set `NIXPACKS_NODE_VERSION=20`.

---

## Benchmarks summary

3 evals on Claude Opus 4.6:

| | With Skill | Without | Delta |
|---|---|---|---|
| Pass rate | 100% | 25% | +75% |
| Avg time | 137.7s | 180.0s | -42.3s |
| Avg tokens | 50,612 | 39,304 | +29% |

Most discriminating test: auto-deploy troubleshooting — 100% vs 0%. Without skill, model actively recommends webhooks (wrong).

---

## Landing page

Separate Next.js 16 app in `landing/`. Tech: React 19, Tailwind 4, Framer Motion, GSAP. Dark theme with neon accents. Components: Terminal, FeaturesGrid, EvolutionTimeline, BenchmarksSection, SetupWorkflow, SecuritySection. Runs on Node 20 (`.nvmrc`).

---

## Non-obvious gotchas

1. **All Dokploy mutations are POST** — no PUT, no DELETE. It's tRPC, not REST.
2. **`githubId` ≠ `gitProviderId`** — use `githubId` from `gitProvider.getAll` response.
3. **`composeFile` not `customCompose`** — wrong field name silently ignored.
4. **DNS --no-proxy is mandatory** for Let's Encrypt to work (HTTP challenge needs direct IP access).
5. **`deployment.logsByDeployment` is unreliable** — always prefer SSH + `logPath` from `deployment.all`.
6. **`saveBuildType` requires Docker/Heroku/Railpack fields even for Nixpacks** — Zod schema doesn't make them optional.
7. **Never set `sourceType: "github"` without `saveGithubProvider`** — causes "Github Provider not found" at deploy time.
8. **SSH passwords via SSHPASS env var** — never `-p` flag (visible in `ps`).
9. **CloudFlare multi-part TLD** — `.co.uk` breaks naive string splitting, script probes API progressively.
10. **`environmentId` required for all *.create calls** since Dokploy v0.27.

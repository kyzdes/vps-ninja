# Changelog

All notable changes to VPS Ninja are documented in this file.

---

## v3.1.1 — 2026-03-18

### Security

- **Fixed command injection in ssh-exec.sh** — `--bg` and `--poll` modes now escape single quotes in commands, preventing injection via crafted arguments
- **SSH passwords no longer visible in process list** — switched from `sshpass -p` flag to `SSHPASS` environment variable
- **DRY refactor of ssh-exec.sh** — extracted `_load_server_config()` and `_run_ssh()` helper functions, reducing code duplication

### Added

- **`--dry-run` mode for deploy** — preview the full deployment plan (project, DNS, env vars) without executing any changes
- **`--server` flag on all commands** — target a specific server in multi-server setups
- **Resource warnings in `/vps status`** — alerts when disk > 80%, RAM > 90%, or Docker images are accumulating
- **Rollback documentation** — `references/troubleshooting.md` now includes rollback strategies for broken deployments
- **Smoke test after manual Docker deploy** — automatic health check after fallback deployment

### Fixed

- **CloudFlare multi-part TLD support** — `.co.uk`, `.com.br`, and similar TLDs now resolve correctly via API zone lookup fallback

---

## v3.1.0 — 2026-03-09

### Fixed (deployment reliability)

- **GitHub App integration completely rewritten** — replaced non-existent REST endpoint `PUT applications/{id}/github` with correct tRPC call `application.saveGithubProvider` + `gitProvider.getAll` for obtaining `githubId`
- **`application.saveBuildType` validation errors** — added 3 missing required fields (`dockerfile`, `herokuVersion`, `railpackVersion`) that Dokploy v0.28 Zod schema demands for all build types, not just Docker
- **`application.saveEnvironment` validation errors** — added 3 missing required fields (`buildArgs`, `buildSecrets`, `createEnvFile`) required by Zod schema
- **All HTTP methods corrected** — documented that Dokploy tRPC uses POST for all mutations (no PUT/DELETE exists)
- **`composeFile` field name** — corrected from `customCompose` in older docs
- **API timeouts** — increased from 30s to 60s for mutation endpoints (`application.update`, `saveBuildType`, etc.) to prevent false timeout errors

### Added

- **4-tier deployment fallback chain** — GitHub App → public git → PAT git → manual Docker build, with automatic strategy selection
- **Server-side repo accessibility check** — SSH to server + `git ls-remote` before choosing deployment strategy
- **SSH long-running command support** — `--bg` mode (nohup background execution) and `--poll` mode (check if process is still running) for Docker builds and other slow operations
- **Manual Docker deploy guide** — new `references/manual-docker-deploy.md` with Dockerfile templates for Next.js, Node.js, Vite, and full Docker Compose raw YAML workflow
- **Next.js Node.js version detection** — auto-detects Next.js version and sets `NIXPACKS_NODE_VERSION` environment variable; creates `.nvmrc` file for Next.js 15+ (requires Node 20+) and 16+ (requires Node 20+)
- **`github_provider_id` caching** — stored in `servers.json` after first lookup to avoid repeated `gitProvider.getAll` calls
- **GitHub App auto-deploy documentation** — new `references/github-app-autodeploy.md` explaining that Dokploy auto-deploys via GitHub App (no webhooks needed)
- **Troubleshooting guide** — new `references/troubleshooting.md` covering 8 categories: build failures, SSL, DNS, connectivity, databases, auto-deploy, SSH, Dokploy panel

### Changed

- **Deploy report now includes auto-deploy note** — "Auto-deploy is active via GitHub App. Push to `<branch>` to trigger redeploy."
- **Skill never suggests webhook setup** — explicitly documented that Dokploy GitHub App handles auto-deploy without webhooks or GitHub Actions
- **`deployment.logsByDeployment` replaced with SSH** — primary log retrieval is now SSH + `logPath` from deployment response (API endpoint unreliable in current Dokploy versions)

---

## v3.0 — 2026-02-28

### Added

- **7 built-in reference guides** — deploy-guide.md, setup-guide.md, stack-detection.md, dokploy-api-reference.md, github-app-autodeploy.md, troubleshooting.md, manual-docker-deploy.md
- **MCP server for Dokploy documentation** — optional Node.js server exposing Dokploy docs as MCP tools (`dokploy_api_reference`, `dokploy_guide`, `dokploy_search`)
- **GitHub App auto-deploy knowledge** — skill understands Dokploy auto-deploys via GitHub App, never suggests webhooks
- **DNS `--no-proxy` mode** — CloudFlare records created in DNS-only mode for Let's Encrypt HTTP challenges
- **Evaluation framework** — 3 benchmark scenarios with assertion-based testing
- **Benchmark results** — 100% pass rate with skill vs 25% without, 42s faster on average

### Changed

- **Language switched to English** — SKILL.md and all reference guides rewritten in English for broader usability
- **Updated for Dokploy v0.27+** — all API calls include `environmentId` parameter
- **Documentation hierarchy** — reference guides are the primary source of truth, web search is last resort
- **Context7 integration** — fallback to `mcp__plugin_context7_context7__query-docs` for edge cases not covered by built-in docs

### Removed

- **Web search dependency** — skill no longer needs web access for standard operations

---

## v2.0 — 2026-02-20

### Changed

- **Updated for Dokploy v0.27 compatibility** — added `environmentId` to all `*.create` API calls
- **Improved security hardening** — better firewall configuration, swap detection
- **Better error messages** — more specific error descriptions with actionable suggestions

### Fixed

- **API calls failing on new Dokploy versions** — `environmentId` was missing from create requests

---

## v1.0 — 2026-02-16

### Added

- **8 commands:** `setup`, `deploy`, `domain`, `db`, `status`, `logs`, `destroy`, `config`
- **4 reference guides:** deploy-guide.md, setup-guide.md, stack-detection.md, dokploy-api-reference.md
- **4 shell scripts:** dokploy-api.sh, cloudflare-dns.sh, ssh-exec.sh, wait-ready.sh
- **VPS setup template** — automated server initialization (firewall, swap, fail2ban)
- **Auto stack detection** — 20+ frameworks across Node.js, Python, Go, Rust, Ruby, Java, .NET, PHP, Docker
- **CloudFlare DNS integration** — automatic A-record creation and management
- **Configuration management** — local `servers.json` for credentials storage
- **Env var discovery** — from `.env.example`, code analysis, ORM schemas, README
- **Database provisioning** — PostgreSQL, MySQL, MariaDB, MongoDB, Redis via Dokploy

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mandatory skills: every branch, every device, every agent

These two skills are required for all work in this repo. They are not optional and apply no matter which branch, machine, or AI agent (Claude Code, Codex, Antigravity, Gemini, Copilot, …) is used. Load both before your first code change and follow them for the whole session.

1. **Ponytail** — [.agents/skills/ponytail/SKILL.md](.agents/skills/ponytail/SKILL.md), level `full`. Applies to every response. Claude Code also loads it as the `ponytail@ponytail` plugin enabled in `.claude/settings.json`; accept the install prompt when you trust this folder.
2. **React Doctor** — [.agents/skills/react-doctor/SKILL.md](.agents/skills/react-doctor/SKILL.md) (Claude Code: `.claude/skills/react-doctor`). After any React change run `pnpm doctor --verbose --scope changed` and fix regressions before committing.

Enforced outside the agent too:
- `.githooks/pre-commit` blocks commits that add React Doctor errors. `pnpm install` enables it on every clone; never bypass it with `--no-verify`.
- `.github/workflows/react-doctor.yml` runs on every push to every branch and on every PR, and fails on new errors.

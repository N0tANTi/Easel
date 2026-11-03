# Easel project working agreements

- This checkout's `origin` is the public fork `N0tANTi/Easel`; `upstream` is `ZJU-REAL/Easel`. Push project changes to the fork and review upstream changes before merging them.
- Durable project records live in `CURRENT_STATE.md`, `ROADMAP.md`, `docs/runbooks/`, and `docs/history/`. Update only the relevant records at a material milestone or on request.
- On this Windows workstation, keep OpenClaw and FFmpeg program files under the ignored `.local/` directory. Use `scripts/start-local.ps1` to start the Web UI on loopback. The OpenClaw profile and browser login profiles remain per-user runtime data outside Git.
- Keep `.env`, `.local/`, `outputs/`, account browser profiles, keys, cookies, and generated media out of Git. Enter or rotate credentials locally.
- Keep `EASEL_PUBLISH_MODE=manual` during the initial brand pilot. Do not claim a post is live until its platform page confirms it. Change the mode only after the brand has approved a concrete publishing workflow.
- A user's approval of a named, reviewable batch permits one-off submission of that batch through the existing platform runners while the Web default stays `manual`. Check the account identity and dry-run first, submit one item at a time, then read it back from the platform; an ambiguous result must be reconciled before any retry. This does not authorize unattended future batches.

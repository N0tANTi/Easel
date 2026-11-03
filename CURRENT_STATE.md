# Current state

Verified on 2026-11-02 (America/Los_Angeles).

- The Windows checkout is at `D:\anti\codexprogram\geo\Easel`. `origin` is the public fork [N0tANTi/Easel](https://github.com/N0tANTi/Easel); `upstream` is [ZJU-REAL/Easel](https://github.com/ZJU-REAL/Easel). The fork's `main` includes commit `66a30fa`, updating DOMPurify to 3.4.17.
- Python dependencies are in `.venv/`; OpenClaw 2026.10.10 and FFmpeg 9.0.2 program files are in ignored `.local/`. Playwright Chromium was installed and launched successfully. OpenClaw runtime configuration is under the current user's `.openclaw-easel/`.
- The primary text model is DeepSeek `deepseek-flash` via its OpenAI-compatible API. Its key is in ignored local configuration. The model endpoint self-test succeeded, `openclaw --profile easel config validate` passed, `easel ping` reached the real Agent, and `easel doctor` reported environment ready.
- `scripts/start-local.ps1` was tested: the Web UI listens on `127.0.0.1:7860` and the Gateway on `127.0.0.1:37289`. The Web UI has no user login, so keep it on loopback.
- `EASEL_PUBLISH_MODE=manual`. The production frontend build passed. `npm audit --omit=dev` reported zero production dependency advisories after the DOMPurify update; the full audit still reported four development dependency advisories.
- The three requested channels (微信公众号、小红书、知乎) are available in the account UI, but none is logged in. The user has not yet supplied brand facts or approved content. No content has been published.

See [the local Windows runbook](docs/runbooks/local-windows.md) for startup and validation. Treat account login, brand profile, and channel publishing as pending until separately verified.

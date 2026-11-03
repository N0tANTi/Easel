# Current state

Verified on 2026-11-02 (America/Los_Angeles).

- The Windows checkout is at `D:\anti\codexprogram\geo\Easel`. `origin` is the public fork [N0tANTi/Easel](https://github.com/N0tANTi/Easel); `upstream` is [ZJU-REAL/Easel](https://github.com/ZJU-REAL/Easel). The fork's `main` includes commit `66a30fa`, updating DOMPurify to 3.4.17.
- Python dependencies are in `.venv/`; OpenClaw 2026.10.10 and FFmpeg 9.0.2 program files are in ignored `.local/`. Playwright Chromium was installed and launched successfully. OpenClaw runtime configuration is under the current user's `.openclaw-easel/`.
- The primary text model is DeepSeek `deepseek-flash` via its OpenAI-compatible API. Its key is in ignored local configuration. The model endpoint self-test succeeded, `openclaw --profile easel config validate` passed, `easel ping` reached the real Agent, and `easel doctor` reported environment ready.
- `scripts/start-local.ps1` was tested: the Web UI listens on `127.0.0.1:7860` and the Gateway on `127.0.0.1:37289`. The Web UI has no user login, so keep it on loopback.
- `EASEL_PUBLISH_MODE=manual`. The production frontend build passed. `npm audit --omit=dev` reported zero production dependency advisories after the DOMPurify update; the full audit still reported four development dependency advisories.
- The user chose one shared profile for HELLOPICNIC and napptopia 呐噗. Brand facts and two first brand-introduction drafts are in ignored local profile/output data; both drafts await image selection and approval. The current phase is text/image only, with no published content.
- Forced account checks confirmed 小红书、知乎、抖音、B站 logged in. 今日头条 scanned successfully but remains at the platform's mandatory phone-binding page, so it is not yet verified as logged in. 微博 is deferred and is not in this Easel build's native account/publish list.
- A Toutiao login-flow fix is implemented and tested: use a visible browser for required phone binding, surface `window_login`, and reject the binding page as a completed login. The user's phone binding and end-to-end login validation are still pending.

See [the local Windows runbook](docs/runbooks/local-windows.md) for startup and validation. Keep publishing manual until a concrete post and workflow are approved; verify each platform-side publication independently.

# Local Windows setup and operation

This runbook is for the `N0tANTi/Easel` fork on a Windows workstation. It keeps OpenClaw and FFmpeg programs inside the checkout. The OpenClaw profile (`~/.openclaw-easel/`) and platform browser profiles (`~/.easel-browser-profiles/`) are per-user runtime state and must never be committed.

## Prerequisites

- Python 3.10+, Node.js 24.16+ (or another version accepted by Easel), Git, and enough space for Python packages, Chromium, and media dependencies.
- A DeepSeek API key, entered only into ignored `.env` or the local Web settings.
- Platform account owners available to scan QR codes when connecting channels.

## Recreate the local program installation

Run from the repository root in PowerShell:

```powershell
New-Item -ItemType Directory -Force .local | Out-Null
npm install --prefix .local\openclaw --no-save --no-audit --no-fund openclaw@2026.10.10
curl.exe --location --fail --output .local\ffmpeg.zip https://github.com/GyanD/codexffmpeg/releases/download/9.0.2/ffmpeg-9.0.2-full_build.zip
Expand-Archive -LiteralPath .local\ffmpeg.zip -DestinationPath .local\ffmpeg
Remove-Item -LiteralPath .local\ffmpeg.zip
$env:Path = (Resolve-Path .local\openclaw\node_modules\.bin).Path + ';' + (Resolve-Path .local\ffmpeg\ffmpeg-9.0.2-full_build\bin).Path + ';' + $env:Path
$env:PYTHONUTF8 = '1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1 -OpenClaw -NonInteractive
.\.venv\Scripts\python.exe -m playwright install chromium
```

The upstream `setup.ps1` installs OpenClaw and FFmpeg system-wide if it cannot find them on `PATH`. Set the two local paths first. Keep `EASEL_PUBLISH_MODE=manual` in `.env`; enter the DeepSeek key and model settings through the local Web UI or another local secret workflow. Never place the key in a tracked file or shell command argument.

## Start and validate

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Open `http://127.0.0.1:7860`. The startup script sets the local program paths, starts the Easel Gateway, then serves the Web UI on loopback. Do not use the default `easel web` entry point on an untrusted network: this upstream version binds `0.0.0.0` and has no Web user login.

In a second PowerShell window, set the same local `PATH` and `PYTHONUTF8` values from above, then run:

```powershell
.\.venv\Scripts\easel.exe doctor
.\.venv\Scripts\easel.exe ping
```

Check that both services listen on `127.0.0.1`, that the model self-test succeeds, and that the correct account identity appears after each platform login. The model self-test checks the API; `ping` also checks an Agent response. Do not infer that a platform post succeeded from an Easel button alone: verify the resulting post or draft on the platform itself.

## Reviewed batch submission and verification

Keep the Web default at `EASEL_PUBLISH_MODE=manual` for the brand pilot. For a named batch the user has already reviewed and approved, confirm the account identity, final title/body/media, photo rights, and intended platform for each item. Run the platform runner without `--exec` first to inspect its plan. Submit one item at a time through the existing runner and immediately check the platform's own published content list or article page; save its public URL/ID in a dated history entry. Xiaohongshu's success screen alone is weaker evidence than its published note manager. Toutiao's API receipt should also be matched to its creator content list.

If a runner reports a timeout or `Failed to fetch` after clicking publish, treat the result as unknown. Check the platform's published list and draft editor before another submission. For an intact draft, resume that same draft rather than creating a new item. The first batch's Zhihu article required this recovery; see [history](../history/2026-11-03-brand-pilot-publishing.md). Platforms may alter the display title; compare the public page and record any change.

For Douyin image/text, use its `publish --images` route and require creator work-list readback with the new work ID and `published` status. The upload page contains both a video input and a multi-image input; choose by accepted media type. This account required a fresh SMS code per item in the first batch. Have the account owner enter it into a local one-time prompt or form; never put the code in CLI arguments, logs, Git, or durable records. If readback does not find the work, inspect creator management before retrying.

Before a larger or unattended workflow, agree on cadence, platform scope, review point, and failure handling, then consider changing the Web publishing mode. Removing a live post is a platform-side correction, not a full rollback of exposure: preserve the URL and reason in history, use the official editor or deletion controls, and verify the final public state. Never copy session data, cookies, private images, or credentials into Git.

For the explicitly approved second batch, the Codex heartbeat `Easel 第二批间隔发布` uses ignored `outputs/_release_schedule_2026-11-03.json` as its release ledger. Each 15-minute run handles at most one due `scheduled` item **per platform** (up to three, sequentially) and uses an ignored local lock to avoid overlapping runs. Before each submission, check the account's current identity and dry-run the appropriate publisher; after submission, independently check the platform creator list or public page. Update both the ledger and review manifest only after that readback. A submitted Xiaohongshu item shown as `审核中` belongs in the ledger's `under_review` list and must not be retried. On an ambiguous submission or expired login, set `needs_reconciliation`, stop that run, and request human intervention. The heartbeat is a Codex app automation on this workstation; Easel's scheduler skill supplies queue logic but does not itself publish or wake the machine. Keep the workstation and relevant local services available during the window. Stop the heartbeat when the batch is complete. The Web default remains manual.

When a Zhihu version is published as text only, read the final title and body without opening its source media. Replace references to absent photos, figures, or visual examples with concrete descriptions of colors, garments, and their relationships. A generic point that a photo cannot prove comfort is acceptable, but a specific claim such as “this photo shows” needs an actual attached image or a self-contained text explanation. Apply this check before the publisher dry-run.

For a Zhihu submission that remains at `/edit`, inspect the existing draft and the public article URL before any further click. The publishing API may return HTTP 200 with a non-success JSON `code`; code `2011` was observed on 2026-11-03 with a 24-hour frequency-limit message. Preserve the same draft, set a retry time after the cooldown, and do not create another draft or click repeatedly. The next Zhihu item should wait until the previous one is verified public.

After the second-batch Xiaohongshu and Toutiao lanes were fully confirmed on 2026-11-03, the heartbeat was reduced from 15-minute runs to hourly Zhihu-only checks. Its ledger still controls the due time; the shorter historical cadence does not authorize more submissions. Third-batch `pending` review items are outside this automation.

## Recovery

- If Chromium login is unavailable, rerun `.\.venv\Scripts\python.exe -m playwright install chromium`, launch a headless Chromium smoke test, and rerun `doctor`.
- If the Gateway is down, start it through `scripts/start-local.ps1` or run `scripts/gateway.ps1 start` with the local OpenClaw directory on `PATH`.
- If a platform session expires, have the account owner log in again through Easel. Do not copy cookies or browser profile directories into Git or chat.
- If the workstation is lost, restore the fork from GitHub, reinstall local dependencies, recreate secrets through the provider consoles, and have account owners scan again. The GitHub fork does not back up runtime profiles or credentials.

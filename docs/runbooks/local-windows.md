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

For the previously approved second batch, the former Codex heartbeat `Easel 第二批间隔发布` used ignored `outputs/_release_schedule_2026-11-03.json` as its release ledger. Its multi-platform publishing scope was superseded on 2026-11-04 by the Toutiao-only schedule below. Preserve its ledger for audit, but do not use it to resume paused platforms. The Web default remains manual.

When a Zhihu version is published as text only, read the final title and body without opening its source media. Replace references to absent photos, figures, or visual examples with concrete descriptions of colors, garments, and their relationships. A generic point that a photo cannot prove comfort is acceptable, but a specific claim such as “this photo shows” needs an actual attached image or a self-contained text explanation. Apply this check before the publisher dry-run.

For a Zhihu submission that remains at `/edit`, inspect the existing draft and the public article URL before any further click. The publishing API may return HTTP 200 with a non-success JSON `code`; code `2011` was observed on 2026-11-03 with a 24-hour frequency-limit message. Preserve the same draft, set a retry time after the cooldown, and do not create another draft or click repeatedly. The next Zhihu item should wait until the previous one is verified public.

After the second-batch Xiaohongshu and Toutiao lanes were fully confirmed on 2026-11-03, that heartbeat was temporarily reduced to hourly Zhihu-only checks. This was superseded by the user's pause; no Zhihu item is currently authorized for automated publication.

## Current Toutiao-only timed batch (2026-11-04)

The authoritative local schedule is ignored `outputs/_toutiao_schedule_2026-11-04.json`; the readable dates are in ignored `outputs/toutiao-schedule-2026-11-04.md`. The former automation `Easel 今日头条定时发送（其他平台暂停）` ran once daily at 18:30 America/Los_Angeles after the user reduced it from 15-minute polling on 2026-11-04. The active schedule is described below. Every run must read the current ledger, acquire its own lock, choose only the earliest due Toutiao row, and check forced account identity `放学去吹风呀`, approved review status, title/body/media, and `outputs/_release_toutiao_knowledge_one.py <id> plan` before `exec`. The helper calls the existing publisher with a Python argument list. After submission, read Toutiao's creator content list independently; only `已发布` with a matching article ID/title permits `outputs/_record_toutiao_knowledge.py` to mark the review item and ledger published. Keep `审核中` pending without retry. On an ambiguous result, stop and reconcile; after 45 minutes past due, mark the window missed and ask for a new schedule rather than publishing late. Do not publish or check paused Xiaohongshu, Zhihu, Douyin, or Weibo accounts. Stop the automation when the authorized Toutiao batch is resolved.

The first article in this batch appeared immediately in Toutiao's `已发布` list after the native `定时发布` dialog showed a future date. Do not use that native scheduling route for another live item until its behavior is understood. Local timed delivery depends on this PC, Codex automation, Easel gateway, Web API, and login session being available; check those before the window. The Web publishing mode remains `manual`.

The November 6–7 windows were missed and the old daily automation was deleted. On November 8 the user authorized recovery and approximately 30-minute spacing. The first recovered article was verified published. Four assistant-reviewed Toutiao-only items were added to the same ignored ledger. The active heartbeat is `easel-30` (`Easel 今日头条每30分钟发布`); it checks the ledger every 30 minutes, with a 45-minute maximum delay after each due time. At most one item may be submitted per run. The user can close the app, but local timed delivery then cannot be relied on; if the window is missed, leave it blocked for a new instruction. Remove the heartbeat when every authorized Toutiao item is confirmed published or has a final blocked outcome. The latest `due_at` values and statuses are in the ledger, not this runbook.

For the current Toutiao-only batch, the private one-item runner probes the account directly through `skills/builtin/skill-toutiao-publisher/scripts/toutiao_publish.py whoami` and the existing browser profile. It then calls the same publisher for plan and exec; Easel Web and OpenClaw Gateway are not needed for this posting path. Keep the Web mode `manual` when the UI is running. Codex app availability is separate: a local heartbeat cannot launch itself while the desktop app is closed. The four remaining items are due about every 30 minutes; consult the ignored JSON ledger for exact times.

For any Python HTTP health checks against `127.0.0.1`, use `urllib.request.build_opener(urllib.request.ProxyHandler({}))`: proxy environment variables otherwise produced a 502 while Web was unreachable and obscured the actual loopback state. If a submit attempt returns no verifiable article ID, check Toutiao's all-content and draft lists; keep the ledger and heartbeat paused until the outcome is reconciled. Do not infer that an absent title is permission to retry.

## Recovery


- If Chromium login is unavailable, rerun `.\.venv\Scripts\python.exe -m playwright install chromium`, launch a headless Chromium smoke test, and rerun `doctor`.
- If the Gateway is down, start it through `scripts/start-local.ps1` or run `scripts/gateway.ps1 start` with the local OpenClaw directory on `PATH`.
- If a platform session expires, have the account owner log in again through Easel. Do not copy cookies or browser profile directories into Git or chat.
- If the workstation is lost, restore the fork from GitHub, reinstall local dependencies, recreate secrets through the provider consoles, and have account owners scan again. The GitHub fork does not back up runtime profiles or credentials.

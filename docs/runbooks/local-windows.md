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

## Recovery

- If Chromium login is unavailable, rerun `.\.venv\Scripts\python.exe -m playwright install chromium`, launch a headless Chromium smoke test, and rerun `doctor`.
- If the Gateway is down, start it through `scripts/start-local.ps1` or run `scripts/gateway.ps1 start` with the local OpenClaw directory on `PATH`.
- If a platform session expires, have the account owner log in again through Easel. Do not copy cookies or browser profile directories into Git or chat.
- If the workstation is lost, restore the fork from GitHub, reinstall local dependencies, recreate secrets through the provider consoles, and have account owners scan again. The GitHub fork does not back up runtime profiles or credentials.

param([int]$Port = 7860)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$openclawBin = Join-Path $root '.local\openclaw\node_modules\.bin'
$ffmpegBin = Join-Path $root '.local\ffmpeg\ffmpeg-9.0.2-full_build\bin'
$python = Join-Path $root '.venv\Scripts\python.exe'

foreach ($path in @($openclawBin, $ffmpegBin, $python)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing local dependency: $path. See docs/runbooks/local-windows.md."
    }
}

$env:Path = "$openclawBin;$ffmpegBin;$env:Path"
$env:PYTHONUTF8 = '1'
$env:EASEL_PORT = [string]$Port
Set-Location $root

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'scripts\gateway.ps1') start
if ($LASTEXITCODE -ne 0) { throw 'Easel gateway failed to start.' }

# Easel's default Web entry point binds every network interface. Keep this
# local workstation instance on loopback because the UI has no user login.
& $python -m uvicorn web.app:app --host 127.0.0.1 --port $Port --log-level warning
exit $LASTEXITCODE

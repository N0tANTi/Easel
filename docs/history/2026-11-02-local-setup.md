# 2026-11-02 — Local Easel setup

Cloned ZJU-REAL/Easel on Windows, then created the public `N0tANTi/Easel` fork. Selected OpenClaw as Easel's execution engine and DeepSeek `deepseek-flash` as the text model. After the first installer pass placed OpenClaw and FFmpeg system-wide, removed those program installations and installed pinned copies under ignored `.local/` as requested.

The default Web entry point was found listening on `0.0.0.0` without a Web login. Added and tested `scripts/start-local.ps1` to bind the local instance to `127.0.0.1`. Updated DOMPurify from 3.4.12 to 3.4.17 after a production dependency audit reported a critical advisory; the subsequent production audit reported zero advisories. Browser launch, frontend build, model API self-test, OpenClaw configuration validation, `easel ping`, and `easel doctor` passed.

Brand facts and platform account login remain pending. No content was published. Runtime credentials and browser profiles were kept out of Git.

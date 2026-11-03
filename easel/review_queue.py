"""Local review queue backed by per-topic review.json manifests in outputs/.

The manifest keeps publication state; post.md remains the editable source of copy.
Only an explicit, confirmed platform readback moves an item out of the queue.
"""
from __future__ import annotations

import hashlib
import json
import re
import threading
from pathlib import Path

_LOCK = threading.Lock()
_STATUSES = {"pending", "approved", "published"}
_PLATFORMS = {"xiaohongshu", "toutiao", "zhihu", "weibo"}


def _inside(root: Path, path: Path) -> bool:
    return path == root or root in path.parents


def _read_manifest(path: Path) -> dict:
    if path.stat().st_size > 128_000:
        raise ValueError("审核清单过大")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("variants"), list):
        raise ValueError("审核清单格式错误")
    return data


def _section(md: str, heading: str) -> tuple[str, str]:
    parts = re.split(r"^##\s+(.+?)\s*$", md, flags=re.M)
    for i in range(1, len(parts), 2):
        if parts[i].strip() != heading:
            continue
        content = parts[i + 1].strip()
        title = re.search(r"^标题[：:]\s*(.+)$", content, flags=re.M)
        body = re.split(r"^正文[：:]\s*$", content, maxsplit=1, flags=re.M)
        return (title.group(1).strip() if title else "", body[1].strip() if len(body) == 2 else content)
    raise ValueError(f"找不到平台文案：{heading}")


def _item_id(root: Path, manifest: Path, platform: str) -> str:
    relative = manifest.relative_to(root).as_posix()
    return hashlib.sha256(f"{relative}:{platform}".encode()).hexdigest()[:20]


def _media(root: Path, names: list) -> list[str]:
    result = []
    if not isinstance(names, list):
        return result
    for name in names[:18]:
        if not isinstance(name, str) or not name:
            continue
        path = (root / name).resolve()
        if _inside(root, path) and path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            result.append(path.relative_to(root).as_posix())
    return result


def list_items(outputs_dir: Path, include_published: bool = False) -> list[dict]:
    root = outputs_dir.resolve()
    if not root.is_dir():
        return []
    result = []
    for manifest in sorted(root.glob("*/**/review.json")):
        if not _inside(root, manifest.resolve()) or any(part.startswith(("_", ".")) for part in manifest.relative_to(root).parts):
            continue
        try:
            data = _read_manifest(manifest)
            source_name = data.get("source", "post.md")
            if not isinstance(source_name, str):
                continue
            source = (manifest.parent / source_name).resolve()
            if not _inside(root, source) or not source.is_file() or source.stat().st_size > 128_000:
                continue
            markdown = source.read_text(encoding="utf-8")
            variants = data["variants"][:20]
            for variant in variants:
                if not isinstance(variant, dict) or variant.get("platform") not in _PLATFORMS:
                    continue
                platform = variant["platform"]
                status = variant.get("status", "pending")
                if status not in _STATUSES or (status == "published" and not include_published):
                    continue
                title, body = _section(markdown, str(variant.get("section", "")))
                if not body:
                    continue
                result.append({
                    "id": _item_id(root, manifest, platform),
                    "brand": str(data.get("brand", ""))[:80],
                    "topic": str(data.get("topic", ""))[:120],
                    "platform": platform,
                    "title": title or body.splitlines()[0][:40],
                    "body": body,
                    "media": _media(root, variant.get("media", data.get("media", []))),
                    "status": status,
                    "published_url": str(variant.get("published_url", "")),
                    "source": source.relative_to(root).as_posix(),
                })
        except (ValueError, TypeError, OSError, UnicodeError, json.JSONDecodeError):
            continue
    return result


def update_status(outputs_dir: Path, item_id: str, status: str, *, confirmed: bool = False,
                  published_url: str = "") -> bool:
    if status not in _STATUSES or (status == "published" and not confirmed):
        raise ValueError("需先核对平台作品，才能标记已发布")
    root = outputs_dir.resolve()
    with _LOCK:
        for manifest in sorted(root.glob("*/**/review.json")):
            if not _inside(root, manifest.resolve()) or any(part.startswith(("_", ".")) for part in manifest.relative_to(root).parts):
                continue
            try:
                data = _read_manifest(manifest)
            except (ValueError, TypeError, OSError, UnicodeError, json.JSONDecodeError):
                continue
            for variant in data["variants"]:
                if not isinstance(variant, dict) or variant.get("platform") not in _PLATFORMS:
                    continue
                if _item_id(root, manifest, variant["platform"]) != item_id:
                    continue
                variant["status"] = status
                if status == "published":
                    variant["published_url"] = published_url.strip()[:500]
                tmp = manifest.with_suffix(".json.tmp")
                tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                tmp.replace(manifest)
                return True
    return False

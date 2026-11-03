import json

import pytest

from easel.review_queue import list_items, update_status


def test_review_queue_reads_platform_copy_and_hides_only_confirmed_publications(tmp_path):
    topic = tmp_path / "batch" / "topic"
    topic.mkdir(parents=True)
    (topic / "post.md").write_text(
        "## 小红书\n\n标题：周末怎么搭\n\n正文：\n\n浅色和深蓝。\n\n#穿搭\n"
        "\n## 知乎纯文字版\n\n标题：如何搭配？\n\n正文：\n\n从颜色开始。\n",
        encoding="utf-8",
    )
    (topic / "01.jpg").write_bytes(b"image")
    (topic / "review.json").write_text(json.dumps({
        "brand": "HELLOPICNIC", "topic": "周末穿搭", "source": "post.md",
        "media": ["batch/topic/01.jpg", "../escape.jpg"],
        "variants": [
            {"platform": "xiaohongshu", "section": "小红书", "status": "pending"},
            {"platform": "zhihu", "section": "知乎纯文字版", "status": "pending", "media": []},
        ],
    }, ensure_ascii=False), encoding="utf-8")

    items = list_items(tmp_path)
    assert len(items) == 2
    xhs = next(item for item in items if item["platform"] == "xiaohongshu")
    assert xhs["title"] == "周末怎么搭"
    assert xhs["body"] == "浅色和深蓝。\n\n#穿搭"
    assert xhs["media"] == ["batch/topic/01.jpg"]
    assert next(item for item in items if item["platform"] == "zhihu")["media"] == []

    with pytest.raises(ValueError):
        update_status(tmp_path, xhs["id"], "published")
    assert update_status(tmp_path, xhs["id"], "approved")
    assert next(item for item in list_items(tmp_path) if item["id"] == xhs["id"])["status"] == "approved"
    assert update_status(tmp_path, xhs["id"], "published", confirmed=True, published_url="https://example.com/post")
    assert len(list_items(tmp_path)) == 1
    assert next(item for item in list_items(tmp_path, include_published=True) if item["id"] == xhs["id"])["published_url"] == "https://example.com/post"

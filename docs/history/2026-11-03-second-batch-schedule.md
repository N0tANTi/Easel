# 2026-11-03 — Approved second-batch paced release

The user approved all 22 drafts in the local review queue and authorized an initial group followed by one post approximately every 10–20 minutes. The six Weibo variants have no working publisher in this fork, and Douyin requires a fresh SMS check for each post. The release scope is therefore 16 Xiaohongshu, Toutiao, and Zhihu variants. The Web default remains `EASEL_PUBLISH_MODE=manual`.

The three account identities were checked immediately before the first group. The HELLOPICNIC dark-blue topic was dry-run and submitted separately on each platform:

| Platform | Observed outcome | Link |
| --- | --- | --- |
| Zhihu | Public article title and body read back | [article](https://zhuanlan.zhihu.com/p/2100999220450931595) |
| Toutiao | Creator content list showed `已发布` for article ID `7703871749795922458` | [article](https://www.toutiao.com/item/7703871749795922458/) |
| Xiaohongshu | Creator note manager showed `审核中`; no public link yet | Pending moderation |

An ignored ledger at `outputs/_release_schedule_2026-11-03.json` holds 13 remaining items, due at 15-minute intervals beginning 2026-11-03 09:30 UTC. A Codex thread heartbeat named `Easel 第二批间隔发布` was created with a 15-minute recurrence. It handles at most one due item per run, verifies account and dry-run before submission, independently checks the platform outcome, and does not retry an ambiguous result. Its first scheduled run has not yet been observed. The Xiaohongshu item under review is recorded separately to prevent duplication. The release ledger and generated media are local runtime data and are not in Git.

After the first Zhihu article went live, the user pointed out that it referred to a visual example although the article contained no image. The live article was intentionally left unchanged. The three remaining Zhihu text drafts were revised locally so their brand examples describe colors and clothing in words rather than pointing at absent photos. The heartbeat prompt now requires a text-only read before each Zhihu submission.

See [current state](../../CURRENT_STATE.md), [roadmap](../../ROADMAP.md), and [operation runbook](../runbooks/local-windows.md).

# 2026-11-03 — Approved second-batch paced release

The user approved all 22 drafts in the local review queue and authorized an initial group followed by one post approximately every 10–20 minutes. The six Weibo variants have no working publisher in this fork, and Douyin requires a fresh SMS check for each post. The release scope is therefore 16 Xiaohongshu, Toutiao, and Zhihu variants. The Web default remains `EASEL_PUBLISH_MODE=manual`.

The three account identities were checked immediately before the first group. The HELLOPICNIC dark-blue topic was dry-run and submitted separately on each platform:

| Platform | Observed outcome | Link |
| --- | --- | --- |
| Zhihu | Public article title and body read back | [article](https://zhuanlan.zhihu.com/p/2100999220450931595) |
| Toutiao | Creator content list showed `已发布` for article ID `7703871749795922458` | [article](https://www.toutiao.com/item/7703871749795922458/) |
| Xiaohongshu | Creator note manager showed `审核中`; no public link yet | Pending moderation |

An ignored ledger at `outputs/_release_schedule_2026-11-03.json` originally held 13 remaining items at 15-minute intervals beginning 2026-11-03 09:30 UTC. A Codex thread heartbeat named `Easel 第二批间隔发布` was created with a 15-minute recurrence. Its first run submitted a napptopia Xiaohongshu note, and the creator center's `已发布` tab later showed both this note and the first HELLOPICNIC note. The creator-center note IDs were recorded in the local ledger and review queue; direct public-page loading was blocked by a Xiaohongshu network-risk gate. The release ledger and generated media are local runtime data and are not in Git.

At the user's request, the 12 still-scheduled items were redistributed into separate Xiaohongshu, Toutiao, and Zhihu lanes, each due every 15 minutes beginning 2026-11-03 09:45 UTC. The heartbeat was updated to handle at most one due item per platform per run, sequentially, with an ignored lock to prevent overlapping runs. Each item still requires account check, dry-run, independent platform readback, and no automatic retry after an uncertain result. The revised multi-platform run has not yet been observed.

After the first Zhihu article went live, the user pointed out that it referred to a visual example although the article contained no image. The live article was intentionally left unchanged. The three remaining Zhihu text drafts were revised locally so their brand examples describe colors and clothing in words rather than pointing at absent photos. The heartbeat prompt now requires a text-only read before each Zhihu submission.

At 2026-11-03 10:05 UTC, the second-batch HELLOPICNIC weekend Toutiao article received ID `7703884224197853706`, but its creator row displayed `审核中`; the local ledger records `under_review`, not `published`. The napptopia animal-pattern Zhihu article was dry-run, then submitted through the publisher. The runner ended at `/p/2101012314971546820/edit` with `Failed to load resource` and no confirmed success. Independent readback showed the public article URL unavailable and the same title/body intact in the draft editor. The ledger records `needs_reconciliation`; no retry or new draft was created. The scheduled Xiaohongshu item was not attempted in that run. The heartbeat was updated to skip later Zhihu items while this draft is unresolved; Toutiao and Xiaohongshu remain scheduled.

After the user said to continue Zhihu, the same draft was checked again: its public URL remained unavailable and its title/body were intact. The editor's publish response was HTTP 200 with JSON code `2011` and the platform message "近期发布频率过高，请24小时后重试~". The draft was not republished or duplicated. Its local state is `rate_limited` until 2026-11-04 10:50 UTC; the two later Zhihu articles were moved to November 5 and 6 at 10:50 UTC and must wait for the prior article to be public. The heartbeat was updated accordingly. The user-facing schedule uses the workstation's America/Los_Angeles time zone.

By 2026-11-03 11:19 UTC, independent creator-center readbacks confirmed all five scheduled Xiaohongshu notes and all five scheduled Toutiao articles as `已发布`, including the final napptopia grey matching posts that had initially shown `审核中`. Their published URLs/IDs and confirmation times are in the ignored release ledger. No remaining Xiaohongshu or Toutiao item requires submission. The heartbeat was narrowed to the three remaining Zhihu articles and reduced to hourly checks while the first draft waits for the 24-hour cooldown. The separate third batch remains pending review and was not scheduled.

See [current state](../../CURRENT_STATE.md), [roadmap](../../ROADMAP.md), and [operation runbook](../runbooks/local-windows.md).

# Local review queue

The Web sidebar's **待发布** page lists platform drafts declared by `outputs/<batch>/<topic>/review.json`. It is separate from the general content library. The page renders an approximate Xiaohongshu, Toutiao, Zhihu, or Weibo view with the images in their intended order. It does not contact those platforms.

## Add a topic

Keep the copy and media under the topic's ignored `outputs/` directory. A `post.md` file uses `##` platform headings, `标题：` and `正文：` lines for article-style drafts. Weibo short text may have no title line. Add a `review.json` beside it:

```json
{
  "version": 1,
  "brand": "Example Brand",
  "topic": "A concise topic",
  "source": "post.md",
  "media": ["batch/topic/01.jpg"],
  "variants": [
    {"platform": "xiaohongshu", "section": "小红书", "status": "pending"},
    {"platform": "zhihu", "section": "知乎纯文字版", "status": "pending", "media": []}
  ]
}
```

Media paths are relative to `outputs/`; they must resolve to existing images inside it. A variant may override the topic's default media to use a designed cover or no images. Supported platform keys are `xiaohongshu`, `toutiao`, `zhihu`, and `weibo`. The `section` must exactly match its `post.md` heading. Copy edits to `post.md` appear on refresh without duplicating the text in the manifest. The parser ignores malformed or missing sources rather than exposing arbitrary files.

## Review and publication state

- `pending`: awaiting review; shown in the queue.
- `approved`: reviewed, still shown until genuinely published.
- `published`: hidden from the default queue. The UI requires the operator to confirm a platform-side readback; a public URL may be saved with the status.

Use **刷新** after editing local files. Before moving an item to `published`, verify the exact account, title, media, and platform work/page. A runner's success message alone is not sufficient. If verification is uncertain, leave the item in the queue and reconcile the platform's content list before retrying. The current page has no automatic platform readback and does not submit posts; Easel's Web publishing mode remains `manual` during the pilot.

To correct a mistaken status, edit only the affected variant's `status` in its local `review.json` back to `pending` or `approved`, then refresh. Do not delete the source copy or images to change queue state. Keep these manifests, private copy, and images out of Git; they are local runtime data and need a separate private backup if they must survive workstation loss.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchReviewItems, mediaUrl, updateReviewItem } from '../lib/api';
import type { ReviewItem } from '../lib/api';

const PLATFORMS: { key: ReviewItem['platform'] | 'all'; label: string }[] = [
  { key: 'all', label: '全部' }, { key: 'xiaohongshu', label: '小红书' },
  { key: 'toutiao', label: '今日头条' }, { key: 'zhihu', label: '知乎' },
  { key: 'weibo', label: '微博' },
];
const LABEL: Record<ReviewItem['platform'], string> = {
  xiaohongshu: '小红书', toutiao: '今日头条', zhihu: '知乎', weibo: '微博',
};

function PlatformPreview({ item }: { item: ReviewItem }) {
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [item.id]);
  const image = item.media[activeImage];
  return <div className={`review-platform-preview review-platform-${item.platform}`}>
    <div className="review-platform-top"><strong>{LABEL[item.platform]}</strong><span>发布效果示意</span></div>
    {item.platform === 'xiaohongshu' && <>
      {image && <img className="review-hero review-hero-xhs" src={mediaUrl(image)} alt={`第 ${activeImage + 1} 张配图`} />}
      {item.media.length > 1 && <div className="review-photo-count">{activeImage + 1} / {item.media.length}</div>}
      <div className="review-platform-content"><h2>{item.title}</h2><div className="review-body">{item.body}</div></div>
    </>}
    {item.platform === 'toutiao' && <>
      <div className="review-platform-content review-article"><h2>{item.title}</h2><div className="review-article-meta">图文 · {item.brand}</div>
        <div className="review-body">{item.body}</div>
        {item.media.map((path, index) => <img key={path} className="review-article-image" src={mediaUrl(path)} alt={`第 ${index + 1} 张配图`} />)}
      </div>
    </>}
    {item.platform === 'zhihu' && <div className="review-platform-content review-article"><h2>{item.title}</h2><div className="review-article-meta">回答预览 · 纯文字</div><div className="review-body">{item.body}</div></div>}
    {item.platform === 'weibo' && <div className="review-platform-content review-weibo"><div className="review-weibo-user"><span className="review-avatar">穿</span><strong>家里家外穿什么</strong><span>刚刚</span></div><div className="review-body">{item.body}</div>
      {item.media.length > 0 && <div className="review-weibo-images">{item.media.slice(0, 9).map((path, index) => <img key={path} src={mediaUrl(path)} alt={`第 ${index + 1} 张配图`} />)}</div>}
    </div>}
    {item.platform === 'xiaohongshu' && item.media.length > 1 && <div className="review-thumbs">{item.media.map((path, index) => <button key={path} type="button" className={index === activeImage ? 'active' : ''} onClick={() => setActiveImage(index)} aria-label={`查看第 ${index + 1} 张图`}><img src={mediaUrl(path)} alt="" /></button>)}</div>}
  </div>;
}

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [platform, setPlatform] = useState<ReviewItem['platform'] | 'all'>('all');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setItems(await fetchReviewItems()); }
    catch (e) { setError(e instanceof Error ? e.message : '读取待发布内容失败'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const filtered = useMemo(() => items.filter((item) => platform === 'all' || item.platform === platform), [items, platform]);
  const selected = filtered.find((item) => item.id === selectedId) || filtered[0];
  useEffect(() => setPublishedUrl(''), [selected?.id]);
  const update = async (status: ReviewItem['status']) => {
    if (!selected || busy) return;
    if (status === 'published' && !window.confirm('请先在平台作品页核对这篇确实已发布。确认后，它会从待发布列表移出。')) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await updateReviewItem(selected.id, status, status === 'published', publishedUrl);
      setItems((prev) => status === 'published' ? prev.filter((item) => item.id !== selected.id)
        : prev.map((item) => item.id === selected.id ? { ...item, status } : item));
      setNotice(status === 'published' ? '已移出待发布列表。' : status === 'approved' ? '已标记审核通过。' : '已退回待审核。');
    } catch (e) { setError(e instanceof Error ? e.message : '更新状态失败'); }
    finally { setBusy(false); }
  };
  const copy = async () => {
    if (!selected) return;
    try { await navigator.clipboard.writeText(`${selected.title}\n\n${selected.body}`); setNotice('标题和正文已复制。'); }
    catch { setError('复制失败，请手动选择预览中的文字。'); }
  };
  const topics = new Set(items.map((item) => `${item.brand}:${item.topic}`)).size;
  return <div className="review-page">
    <header className="review-head"><div><div className="review-eyebrow">CONTENT REVIEW</div><h1>待发布</h1><p>{topics} 个主题 · {items.length} 个平台版本。按平台查看图文排版，审核通过后仍留在这里，发布核对完成才移出。</p></div><button type="button" className="review-refresh" onClick={() => void refresh()} disabled={loading}>刷新</button></header>
    <div className="review-filters">{PLATFORMS.map((p) => <button key={p.key} type="button" className={platform === p.key ? 'active' : ''} onClick={() => setPlatform(p.key)}>{p.label}<span>{p.key === 'all' ? items.length : items.filter((item) => item.platform === p.key).length}</span></button>)}</div>
    {error && <div className="review-error" role="alert">{error}</div>}
    {notice && <div className="review-notice" role="status">{notice}</div>}
    {loading ? <div className="review-empty">正在读取待发布内容…</div> : !selected ? <div className="review-empty">这个平台目前没有待发布内容。</div> : <div className="review-layout">
      <div className="review-list" aria-label="待发布稿件">{filtered.map((item) => <button type="button" key={item.id} className={`review-list-item ${selected.id === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
        {item.media[0] ? <img src={mediaUrl(item.media[0])} alt="" /> : <span className="review-text-icon">文</span>}
        <span className="review-list-copy"><span className="review-list-meta">{LABEL[item.platform]} · {item.brand}</span><strong>{item.title}</strong><span className="review-list-topic">{item.topic}</span></span>
        <span className={`review-status ${item.status}`}>{item.status === 'approved' ? '已通过' : '待审核'}</span>
      </button>)}</div>
      <div className="review-detail"><div className="review-detail-head"><div><span className="review-detail-topic">{selected.brand} · {selected.topic}</span><h2>{selected.title}</h2></div><span className={`review-status ${selected.status}`}>{selected.status === 'approved' ? '审核通过' : '待审核'}</span></div>
        <div className="review-preview-wrap"><PlatformPreview item={selected} /></div>
        <div className="review-detail-actions"><div className="review-action-row"><button type="button" onClick={() => void copy()} disabled={busy}>复制标题和正文</button>{selected.status === 'pending' ? <button type="button" className="primary" onClick={() => void update('approved')} disabled={busy}>审核通过</button> : <button type="button" onClick={() => void update('pending')} disabled={busy}>退回待审核</button>}</div>
          {selected.platform === 'weibo' && <p>微博发布入口尚未接通；这篇仅供预览和审核。</p>}
          <label htmlFor="review-published-url">作品链接（可选）</label><input id="review-published-url" value={publishedUrl} onChange={(e) => setPublishedUrl(e.target.value)} placeholder="平台作品页链接，方便以后查找" />
          <button type="button" className="review-done" onClick={() => void update('published')} disabled={busy}>已在平台核对发布 · 移出待发</button>
        </div>
      </div>
    </div>}
  </div>;
}

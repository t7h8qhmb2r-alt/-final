'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import type { Shop, AIResult, SearchCondition } from './types';

const MapView = dynamic(() => import('./components/MapView'), { ssr: false });

/* ─── constants ─────────────────────────────── */
const BUDGETS = [
  { key: 'low',    label: '〜1,500円',  emoji: '🪙', sub: 'リーズナブルに' },
  { key: 'mid',    label: '2,000〜3,000円', emoji: '💴', sub: 'ほどよく楽しむ' },
  { key: 'high',   label: '4,000〜5,000円', emoji: '💳', sub: 'ちょっと贅沢に' },
  { key: 'luxury', label: '7,000円〜',  emoji: '💎', sub: '今夜は特別な夜' },
] as const;

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

const MOODS = [
  { label: 'ゆったり話したい 🍷',   value: 'ゆったりと落ち着いた雰囲気で話したい。個室や静かな席があると嬉しい' },
  { label: 'わいわい盛り上がる 🎉', value: 'にぎやかでわいわい盛り上がれる雰囲気が欲しい。飲み放題があると最高' },
  { label: 'おしゃれに決めたい ✨', value: 'おしゃれな雰囲気で特別感のある夜を過ごしたい' },
  { label: 'がっつり食べたい 🍖',   value: 'しっかり食事も楽しみたい。コース料理や食べ放題が嬉しい' },
  { label: 'サクッと一杯 🍺',       value: 'サクッと短時間で飲める、気軽に入れるお店が良い' },
  { label: '二次会・シメ 🌙',       value: '二次会や締めに使いやすい、気軽に入れてリーズナブルなお店' },
] as const;

const RANGES = [
  { value: '2', label: '500m' },
  { value: '3', label: '1km' },
  { value: '4', label: '2km' },
  { value: '5', label: '3km' },
];

const INITIAL_COND: SearchCondition = {
  budget: 'mid',
  partySize: 2,
  mood: MOODS[0].value,
  area: '',
  range: '3',
};

/* ─── helpers ────────────────────────────────── */
function ScoreBar({ value }: { value: number }) {
  return (
    <div className={styles.scoreBar}>
      {[1,2,3,4,5].map(n => (
        <div key={n} className={`${styles.scoreDot} ${n <= value ? styles.scoreDotFill : ''}`} />
      ))}
    </div>
  );
}

/* ─── main component ─────────────────────────── */
export default function Home() {
  const [step, setStep]           = useState<0|1|2|3>(0); // 0=init,1=条件,2=loading,3=results
  const [cond, setCond]           = useState<SearchCondition>(INITIAL_COND);
  const [location, setLocation]   = useState<{lat:number;lng:number}|null>(null);
  const [locStatus, setLocStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [shops, setShops]         = useState<Shop[]>([]);
  const [aiResult, setAiResult]   = useState<AIResult|null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop|null>(null);
  const [error, setError]         = useState('');
  const [stepForm, setStepForm]   = useState<1|2|3|4>(1); // sub-step within step 1

  /* ── location ── */
  const getLocation = () => {
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      },
      err => {
        console.error(err);
        setLocStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ── search + AI ── */
  const runSearch = async () => {
    if (!location) return;
    setStep(2);
    setError('');

    try {
      // 1. HotPepper検索
      const params = new URLSearchParams({
        lat:       String(location.lat),
        lng:       String(location.lng),
        budget:    cond.budget,
        partySize: String(cond.partySize),
        range:     cond.range,
      });
      const searchRes = await fetch(`/api/search?${params}`);
      const searchData = await searchRes.json();

      if (!searchRes.ok || !searchData.shops) {
        throw new Error(searchData.error || '検索に失敗しました');
      }

      const foundShops: Shop[] = searchData.shops;
      setShops(foundShops);

      if (foundShops.length === 0) {
        setError('条件に合うお店が見つかりませんでした。範囲を広げてみてください。');
        setStep(1);
        return;
      }

      // 2. Gemini分析
      const aiRes = await fetch('/api/gemini-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shops: foundShops,
          budget:    cond.budget,
          partySize: cond.partySize,
          mood:      cond.mood,
          area:      cond.area || '現在地周辺',
        }),
      });
      const aiData = await aiRes.json();

      if (aiData.top3) {
        setAiResult(aiData);
      }

      setStep(3);
    } catch (e) {
      setError(String(e));
      setStep(1);
    }
  };

  const handleShopClick = useCallback((shop: Shop) => setSelectedShop(shop), []);

  const top3Ids = aiResult?.top3.map(p => shops[p.shopIndex - 1]?.id).filter(Boolean) as string[] || [];

  const budgetLabel = BUDGETS.find(b => b.key === cond.budget)?.label || '';

  /* ── render ── */
  return (
    <div className={styles.root}>
      {/* ═══ STEP 0: splash ═══ */}
      {step === 0 && (
        <div className={styles.splash}>
          <div className={styles.splashBg} />
          <div className={styles.splashContent}>
            <div className={styles.splashIcon}>🍺</div>
            <h1 className={styles.splashTitle}>居酒屋<br/>ファインダー</h1>
            <p className={styles.splashSub}>AIが条件を分析して<br/>予約できるお店を探します</p>
            <button className={styles.splashBtn} onClick={() => { getLocation(); setStep(1); }}>
              今夜のお店を探す
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 1: conditions ═══ */}
      {step === 1 && (
        <div className={styles.condPage}>
          <header className={styles.condHeader}>
            <button className={styles.backBtn} onClick={() => setStep(0)}>← 戻る</button>
            <h1 className={styles.condTitle}>条件を入力</h1>
            <div className={styles.stepDots}>
              {[1,2,3,4].map(n => (
                <div key={n} className={`${styles.stepDot} ${n <= stepForm ? styles.stepDotActive : ''}`} />
              ))}
            </div>
          </header>

          <div className={styles.condBody}>
            {/* Sub-step 1: Budget */}
            {stepForm === 1 && (
              <div className={styles.formSection} style={{animation:'fadeUp 0.3s ease'}}>
                <h2 className={styles.formQ}>1人あたりの予算は？</h2>
                <div className={styles.budgetGrid}>
                  {BUDGETS.map(b => (
                    <button
                      key={b.key}
                      className={`${styles.budgetCard} ${cond.budget === b.key ? styles.budgetCardActive : ''}`}
                      onClick={() => { setCond(c => ({...c, budget: b.key as SearchCondition['budget']})); setStepForm(2); }}
                    >
                      <span className={styles.budgetEmoji}>{b.emoji}</span>
                      <span className={styles.budgetLabel}>{b.label}</span>
                      <span className={styles.budgetSub}>{b.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-step 2: Party size */}
            {stepForm === 2 && (
              <div className={styles.formSection} style={{animation:'fadeUp 0.3s ease'}}>
                <h2 className={styles.formQ}>何人で？</h2>
                <div className={styles.partySizeGrid}>
                  {PARTY_SIZES.map(n => (
                    <button
                      key={n}
                      className={`${styles.sizeBtn} ${cond.partySize === n ? styles.sizeBtnActive : ''}`}
                      onClick={() => { setCond(c => ({...c, partySize: n})); setStepForm(3); }}
                    >
                      {n}人
                    </button>
                  ))}
                </div>
                <button className={styles.prevBtn} onClick={() => setStepForm(1)}>← 戻る</button>
              </div>
            )}

            {/* Sub-step 3: Mood */}
            {stepForm === 3 && (
              <div className={styles.formSection} style={{animation:'fadeUp 0.3s ease'}}>
                <h2 className={styles.formQ}>今夜の気分は？</h2>
                <div className={styles.moodList}>
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      className={`${styles.moodBtn} ${cond.mood === m.value ? styles.moodBtnActive : ''}`}
                      onClick={() => { setCond(c => ({...c, mood: m.value})); setStepForm(4); }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <button className={styles.prevBtn} onClick={() => setStepForm(2)}>← 戻る</button>
              </div>
            )}

            {/* Sub-step 4: Confirm */}
            {stepForm === 4 && (
              <div className={styles.formSection} style={{animation:'fadeUp 0.3s ease'}}>
                <h2 className={styles.formQ}>確認 & 検索</h2>

                {/* Summary */}
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>💴 予算</span>
                    <span className={styles.summaryVal}>{budgetLabel}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>👥 人数</span>
                    <span className={styles.summaryVal}>{cond.partySize}人</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>💭 気分</span>
                    <span className={styles.summaryVal}>{MOODS.find(m => m.value === cond.mood)?.label || ''}</span>
                  </div>
                </div>

                {/* Range */}
                <div className={styles.rangeRow}>
                  <span className={styles.summaryKey}>📍 検索範囲</span>
                  <div className={styles.rangeButtons}>
                    {RANGES.map(r => (
                      <button
                        key={r.value}
                        className={`${styles.rangeBtn} ${cond.range === r.value ? styles.rangeBtnActive : ''}`}
                        onClick={() => setCond(c => ({...c, range: r.value}))}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location status */}
                <div className={styles.locRow}>
                  {locStatus === 'idle' && <button className={styles.locGetBtn} onClick={getLocation}>📍 現在地を取得</button>}
                  {locStatus === 'loading' && <span className={styles.locLoading}>取得中...</span>}
                  {locStatus === 'ok'      && <span className={styles.locOk}>✓ 現在地取得済み</span>}
                  {locStatus === 'error'   && <span className={styles.locErr}>⚠ 位置情報の取得に失敗しました</span>}
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}

                <button
                  className={styles.searchBtn}
                  onClick={runSearch}
                  disabled={locStatus !== 'ok'}
                >
                  🔍 AIで最適なお店を探す
                </button>

                <button className={styles.prevBtn} onClick={() => setStepForm(3)}>← 戻る</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 2: loading ═══ */}
      {step === 2 && (
        <div className={styles.loadingPage}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}>🍺</div>
            <h2 className={styles.loadingTitle}>AIが分析中...</h2>
            <div className={styles.loadingSteps}>
              <div className={styles.loadingStep}>📍 周辺の居酒屋を検索中</div>
              <div className={styles.loadingStep} style={{animationDelay:'0.8s'}}>🏮 空き状況を確認中</div>
              <div className={styles.loadingStep} style={{animationDelay:'1.6s'}}>🤖 AIが最適な店を選定中</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: results ═══ */}
      {step === 3 && (
        <div className={styles.resultsPage}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <button className={styles.backBtn2} onClick={() => { setStep(1); setStepForm(4); }}>← 条件変更</button>
              <h2 className={styles.sidebarTitle}>検索結果</h2>
              <span className={styles.shopCount}>{shops.length}件</span>
            </div>

            {/* AI comment */}
            {aiResult && (
              <div className={styles.aiComment}>
                <span className={styles.aiCommentIcon}>🤖</span>
                <p className={styles.aiCommentText}>{aiResult.aiComment}</p>
                {aiResult.tips && <p className={styles.aiTips}>💡 {aiResult.tips}</p>}
              </div>
            )}

            {/* TOP 3 picks */}
            {aiResult && (
              <div className={styles.top3Section}>
                <h3 className={styles.top3Title}>✨ AIのおすすめ TOP 3</h3>
                {aiResult.top3.map((pick) => {
                  const shop = shops[pick.shopIndex - 1];
                  if (!shop) return null;
                  const rankColors = ['#c96eff','#ff6b9d','#ffb347'];
                  return (
                    <div
                      key={pick.rank}
                      className={styles.pickCard}
                      style={{'--rank-color': rankColors[pick.rank-1]} as React.CSSProperties}
                      onClick={() => setSelectedShop(shop)}
                    >
                      <div className={styles.pickHeader}>
                        <span className={styles.pickRank}>{['🥇','🥈','🥉'][pick.rank-1]}</span>
                        <div className={styles.pickNameWrap}>
                          <span className={styles.pickName}>{shop.name}</span>
                          <span className={styles.pickHighlight}>{pick.highlight}</span>
                        </div>
                        {shop.online_reserve === '1' && (
                          <span className={styles.reserveTag}>予約可</span>
                        )}
                      </div>
                      <p className={styles.pickReason}>{pick.reason}</p>
                      <div className={styles.pickScores}>
                        <div className={styles.scoreItem}><span>予算</span><ScoreBar value={pick.score.budget} /></div>
                        <div className={styles.scoreItem}><span>雰囲気</span><ScoreBar value={pick.score.mood} /></div>
                        <div className={styles.scoreItem}><span>予約</span><ScoreBar value={pick.score.reservation} /></div>
                      </div>
                      {shop.urls?.pc && (
                        <a
                          href={shop.urls.pc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.reserveBtn}
                          onClick={e => e.stopPropagation()}
                        >
                          ホットペッパーで予約 →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* All shops list */}
            <div className={styles.allShops}>
              <h3 className={styles.allShopsTitle}>全件リスト</h3>
              {shops.map((shop, i) => {
                const isTop = top3Ids.includes(shop.id);
                return (
                  <div
                    key={shop.id}
                    className={`${styles.shopRow} ${selectedShop?.id === shop.id ? styles.shopRowActive : ''} ${isTop ? styles.shopRowTop : ''}`}
                    onClick={() => setSelectedShop(shop)}
                  >
                    <span className={styles.shopRowNum}>{i+1}</span>
                    <div className={styles.shopRowInfo}>
                      <span className={styles.shopRowName}>{shop.name}</span>
                      <span className={styles.shopRowMeta}>
                        {shop.genre?.name}
                        {shop.online_reserve === '1' && ' · 🟢 予約可'}
                        {shop.budget?.average && ` · ${shop.budget.average}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Map */}
          <main className={styles.mapArea}>
            <MapView
              shops={shops}
              userLocation={location}
              highlightedIds={top3Ids}
              onShopClick={handleShopClick}
            />

            {/* Shop detail panel */}
            {selectedShop && (
              <div className={styles.detailPanel}>
                <button className={styles.detailClose} onClick={() => setSelectedShop(null)}>✕</button>
                {selectedShop.photo?.mobile?.l && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedShop.photo.mobile.l} alt={selectedShop.name} className={styles.detailImg} />
                )}
                <div className={styles.detailBody}>
                  <h3 className={styles.detailName}>{selectedShop.name}</h3>
                  <div className={styles.detailTags}>
                    {selectedShop.genre && <span className={styles.detailTag}>{selectedShop.genre.name}</span>}
                    {selectedShop.online_reserve === '1' && <span className={`${styles.detailTag} ${styles.detailTagGreen}`}>🟢 オンライン予約可</span>}
                    {selectedShop.free_food === '1' && <span className={styles.detailTag}>🍻 飲み放題</span>}
                    {selectedShop.private_room === '1' && <span className={styles.detailTag}>🚪 個室</span>}
                    {selectedShop.course === '1' && <span className={styles.detailTag}>🍽 コースあり</span>}
                  </div>
                  {selectedShop.catch && <p className={styles.detailCatch}>{selectedShop.catch}</p>}
                  <div className={styles.detailMeta}>
                    {selectedShop.budget?.average && <div>💴 {selectedShop.budget.average}</div>}
                    {selectedShop.access && <div>🚶 {selectedShop.access}</div>}
                    {selectedShop.open && <div>🕐 {selectedShop.open}</div>}
                    {selectedShop.capacity && <div>💺 {selectedShop.capacity}席</div>}
                  </div>
                  {/* AI comment for this shop */}
                  {(() => {
                    const idx = shops.findIndex(s => s.id === selectedShop.id) + 1;
                    const pick = aiResult?.top3.find(p => p.shopIndex === idx);
                    if (!pick) return null;
                    return (
                      <div className={styles.detailAI}>
                        <span>{['🥇','🥈','🥉'][pick.rank-1]} AIコメント</span>
                        <p>{pick.reason}</p>
                      </div>
                    );
                  })()}
                  {selectedShop.urls?.pc && (
                    <a href={selectedShop.urls.pc} target="_blank" rel="noopener noreferrer" className={styles.detailReserveBtn}>
                      ホットペッパーで予約・詳細を見る →
                    </a>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

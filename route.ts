import { NextRequest, NextResponse } from 'next/server';

// Budget code mapping (HotPepper budget codes)
// B001: ~500, B002: ~1000, B003: ~1500, B004: ~2000, B008: ~2500,
// B005: ~3000, B006: ~4000, B012: ~5000, B013: ~7000, B014: ~10000+
function getBudgetCode(priceRange: string): string {
  switch (priceRange) {
    case 'low':    return 'B002,B003';      // ~1500円
    case 'mid':    return 'B004,B008,B005'; // 2000〜3000円
    case 'high':   return 'B006,B012';      // 4000〜5000円
    case 'luxury': return 'B013,B014';      // 7000円〜
    default:       return 'B004,B008,B005';
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat       = searchParams.get('lat');
  const lng       = searchParams.get('lng');
  const budget    = searchParams.get('budget') || 'mid';
  const partySize = searchParams.get('partySize') || '2';
  const range     = searchParams.get('range') || '3';
  const keyword   = searchParams.get('keyword') || '';

  if (!lat || !lng) {
    return NextResponse.json({ error: '緯度経度が必要です' }, { status: 400 });
  }

  const apiKey = process.env.HOTPEPPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'APIキーが未設定です' }, { status: 500 });
  }

  const params = new URLSearchParams({
    key: apiKey,
    lat,
    lng,
    range,
    count: '30',
    format: 'json',
    // 居酒屋・バー・ダイニングバー関連ジャンル
    genre: 'G001,G002,G003,G004,G005,G006,G008,G009,G013',
    budget: getBudgetCode(budget),
    // 予約可能なお店のみ
    // private_room: '1', // 必要に応じてコメントアウト解除
  });

  // キーワードがあれば追加
  if (keyword) params.set('keyword', keyword);

  // 人数フィルタ: capacity (ホットペッパーAPIは直接フィルタ不可だがcountと組み合わせる)
  // party_sizeは後でフロント側でフィルタリング

  const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      console.error('HotPepper API error:', res.status, text);
      return NextResponse.json({ error: `HotPepper APIエラー: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();

    // 営業中のお店 + 予約可能なお店を優先してフィルタ
    const shops = (data.results?.shop || []) as HotPepperShop[];

    // 予約可能なお店を優先ソート（free_food + reservations available）
    const sorted = shops.sort((a: HotPepperShop, b: HotPepperShop) => {
      const aScore = (a.online_reserve === '1' ? 2 : 0) + (a.free_food === '1' ? 1 : 0);
      const bScore = (b.online_reserve === '1' ? 2 : 0) + (b.free_food === '1' ? 1 : 0);
      return bScore - aScore;
    });

    return NextResponse.json({
      shops: sorted,
      total: data.results?.results_available || 0,
      partySize: parseInt(partySize),
    });
  } catch (e) {
    console.error('Search error:', e);
    return NextResponse.json({ error: 'ネットワークエラー' }, { status: 500 });
  }
}

interface HotPepperShop {
  online_reserve?: string;
  free_food?: string;
  [key: string]: unknown;
}

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini APIキーが未設定です' }, { status: 500 });
  }

  const body = await req.json();
  const { shops, budget, partySize, mood, area } = body;

  if (!shops || shops.length === 0) {
    return NextResponse.json({ error: '店舗情報がありません' }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const budgetLabel: Record<string, string> = {
    low: '〜1500円',
    mid: '2000〜3000円',
    high: '4000〜5000円',
    luxury: '7000円〜',
  };

  const shopListText = shops
    .slice(0, 15)
    .map((s: ShopInput, i: number) => {
      const canReserve = s.online_reserve === '1' ? '【オンライン予約可】' : '【要電話確認】';
      const freeFood = s.free_food === '1' ? '飲み放題あり' : '';
      const freeDrink = s.free_drink === '1' ? '食べ放題あり' : '';
      return `${i + 1}. ${s.name} ${canReserve}
   ジャンル:${s.genre?.name || '居酒屋'} | 予算:${s.budget?.average || '不明'} | ${freeFood}${freeDrink}
   特徴:${s.catch || s.genre?.catch || 'なし'}
   アクセス:${s.access || '不明'}
   座席数:${s.capacity ? s.capacity + '席' : '不明'}`;
    })
    .join('\n\n');

  const prompt = `あなたは居酒屋のプロコンシェルジュです。以下の条件と店舗リストを分析して、最適なお店TOP3を選んでください。

【お客様の条件】
- 人数: ${partySize}人
- 予算: 1人${budgetLabel[budget] || '2000〜3000円'}
- 気分・要望: ${mood}
- エリア: ${area || '現在地周辺'}

【候補店舗】
${shopListText}

以下の観点で総合的に判断してください:
1. 予算との一致度
2. 人数に適した座席数・個室の有無
3. 気分・要望との一致度
4. 予約のしやすさ（オンライン予約 > 電話予約）
5. 口コミ・雰囲気

必ず以下のJSON形式のみで返してください（マークダウン記法・コードブロック不要）:
{
  "top3": [
    {
      "rank": 1,
      "shopIndex": 1,
      "reason": "このお店がおすすめな理由（50〜80文字、です・ます調で具体的に）",
      "highlight": "一言キャッチ（15文字以内）",
      "score": {
        "budget": 5,
        "capacity": 4,
        "mood": 5,
        "reservation": 5
      }
    }
  ],
  "aiComment": "今夜の飲み会へのメッセージ（40文字以内、テンション高め）",
  "tips": "今夜の予約で注意すること（30文字以内）"
}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // JSONブロックを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini raw response:', text);
      return NextResponse.json({ error: 'AI応答のパースに失敗', raw: text }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error('Gemini error:', e);
    return NextResponse.json({ error: 'Gemini APIエラー: ' + String(e) }, { status: 500 });
  }
}

interface ShopInput {
  name: string;
  online_reserve?: string;
  free_food?: string;
  free_drink?: string;
  genre?: { name: string; catch?: string };
  budget?: { average: string };
  catch?: string;
  access?: string;
  capacity?: number;
  [key: string]: unknown;
}

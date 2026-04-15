"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 実際の表示部分を別のコンポーネントに分ける
function ResultsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function init() {
      try {
        const sRes = await fetch("/api/suggest", { 
          method: "POST", 
          body: JSON.stringify(Object.fromEntries(searchParams)) 
        });
        const sugg = await sRes.json();
        
        const hRes = await fetch(`/api/shops?lat=${searchParams.get("lat")}&lng=${searchParams.get("lng")}&keyword=${sugg.keyword}`);
        const shops = await hRes.json();
        
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) {
        console.error(e);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    init();
  }, [searchParams]);

  if (data.loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-white">AIが厳選中...</div>;

  return (
    <main className="p-4 space-y-6 bg-[#0f172a] min-h-screen text-white">
      <div className="bg-pink-500/20 p-4 rounded-2xl border border-pink-500/30 text-sm">
        ✨ AIの提案: <strong>{data.suggestion?.keyword}</strong><br/>{data.suggestion?.reason}
      </div>
      <div className="grid gap-4">
        {data.shops.length > 0 ? (
          data.shops.map((shop: any) => (
            <div key={shop.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <img src={shop.photo.pc.l} className="h-40 w-full object-cover" alt={shop.name} />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-bold">{shop.name}</h3>
                <p className="text-gray-400 text-sm">{shop.catch}</p>
                <div className="flex gap-2">
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">{shop.budget.name}</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">{shop.capacity}席</span>
                </div>
                <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-black text-center py-3 rounded-xl font-bold mt-2">お店を見る</a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">近くにお店が見つかりませんでした</div>
        )}
      </div>
    </main>
  );
}

// エラーを回避するために Suspense で囲む
export default function Results() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">読み込み中...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

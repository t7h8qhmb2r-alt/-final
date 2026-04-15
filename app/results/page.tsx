"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 中身の表示用コンポーネント
function ResultsList() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function fetchData() {
      try {
        const sRes = await fetch("/api/suggest", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(searchParams))
        });
        const sugg = await sRes.json();
        
        const hRes = await fetch(`/api/shops?lat=${searchParams.get("lat")}&lng=${searchParams.get("lng")}&keyword=${sugg.keyword}`);
        const shops = await hRes.json();
        
        setData({ 
          shops: Array.isArray(shops) ? shops : [], 
          suggestion: sugg, 
          loading: false 
        });
      } catch (error) {
        console.error(error);
        setData(d => ({ ...d, loading: false }));
      }
    }
    fetchData();
  }, [searchParams]);

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500 mx-auto"></div>
          <p className="font-bold animate-pulse">AIが最適な2軒目を厳選中...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-4 pb-20">
      {data.suggestion && (
        <div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-2xl mb-6">
          <p className="text-xs text-pink-400 font-bold mb-1">AIの提案キーワード: {data.suggestion.keyword}</p>
          <p className="text-sm">{data.suggestion.reason}</p>
        </div>
      )}

      <div className="grid gap-4">
        {data.shops.map((shop: any) => (
          <div key={shop.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <img src={shop.photo.pc.l} className="w-full h-48 object-cover" alt={shop.name} />
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-bold">{shop.name}</h2>
              <p className="text-gray-400 text-sm line-clamp-2">{shop.catch}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">{shop.budget.name}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">{shop.genre.name}</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-black">{shop.capacity}席</span>
              </div>
              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" 
                 className="block w-full bg-white text-black text-center py-4 rounded-2xl font-black mt-4 active:scale-95 transition">
                お店の詳細・予約
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// 全体をSuspenseで囲んでエクスポート
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        準備中...
      </div>
    }>
      <ResultsList />
    </Suspense>
  );
}

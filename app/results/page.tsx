"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Star, Utensils, Zap } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    init();
  }, [searchParams]);

  if (data.loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-center space-y-8">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 animate-pulse" size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white italic">AI分析中...</h2>
        <p className="text-gray-500 font-medium tracking-tighter">あなたの気分に合う店を厳選しています</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 pb-12">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => router.back()} className="p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black italic italic tracking-tighter">AI SELECTION</h1>
      </header>
      
      {data.suggestion && (
        <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-[1px] rounded-[2rem] mb-10 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          <div className="bg-[#020617] rounded-[2rem] p-6 space-y-2">
            <div className="flex items-center gap-2 text-pink-500 font-black text-xs tracking-widest uppercase">
              <Sparkles size={14} /> AI Recommendation
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{data.suggestion.keyword}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{data.suggestion.reason}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {data.shops.map((shop: any) => (
          <div key={shop.id} className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col transition active:scale-[0.98]">
            <div className="relative h-56 w-full">
              <img src={shop.photo.pc.l} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={shop.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-pink-600 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
                  {shop.genre.name}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">{shop.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                  <MapPin size={14} className="text-orange-500" />
                  <span className="truncate">{shop.address}</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm font-medium leading-snug line-clamp-2">{shop.catch}</p>
              
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Banknote size={14} className="text-green-400" />
                  <span className="text-xs font-bold text-gray-300">{shop.budget.name}</span>
                </div>
                <div className="flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                  <Utensils size={14} className="text-green-400" />
                  <span className="text-xs font-black text-green-400">{shop.capacity}席</span>
                </div>
              </div>

              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" 
                 className="block w-full bg-white text-black text-center py-4 rounded-[1.2rem] font-black text-lg shadow-xl shadow-white/5 active:bg-gray-200 transition">
                お店の詳細・予約
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

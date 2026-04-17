"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, Utensils, Banknote } from "lucide-react";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function init() {
      try {
        const sRes = await fetch("/api/suggest", { method: "POST", body: JSON.stringify(Object.fromEntries(params)) });
        const sugg = await sRes.json();
        const hRes = await fetch(`/api/shops?lat=${params.get("lat")}&lng=${params.get("lng")}&keyword=${encodeURIComponent(sugg.keyword)}`);
        const shops = await hRes.json();
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) { setData(d => ({ ...d, loading: false })); }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-6 p-10 text-center">
      <div className="w-20 h-20 border-4 border-pink-500/10 border-t-pink-500 rounded-full animate-spin"></div>
      <div className="space-y-2">
        <p className="text-white text-2xl font-black italic tracking-tighter">AI厳選中...</p>
        <p className="text-gray-500 text-sm">現在の位置情報と気分から<br/>最高のお店をピックアップしています</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] p-4 pb-20 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="mb-6 p-4 bg-white/5 rounded-[1.5rem] border border-white/10 active:scale-90 transition">
        <ArrowLeft size={24} />
      </button>
      
      {data.suggestion && (
        <div className="bg-gradient-to-br from-pink-600/20 to-orange-600/20 border border-white/10 p-8 rounded-[2.5rem] mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={40}/></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">{data.suggestion.keyword}</h2>
            <p className="text-gray-300 text-base leading-relaxed font-medium">{data.suggestion.reason}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {data.shops.length > 0 ? data.shops.map((shop: any) => (
          <div key={shop.id} className="bg-white/[0.03] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="relative h-64">
              <img src={shop.photo.pc.l} className="w-full h-full object-cover" alt={shop.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
              <div className="absolute bottom-6 left-6"><span className="bg-pink-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">{shop.genre.name}</span></div>
            </div>
            <div className="p-8 space-y-5">
              <h3 className="text-3xl font-black tracking-tighter">{shop.name}</h3>
              <div className="flex items-start gap-2 text-gray-500 text-xs font-medium"><MapPin size={14} className="text-orange-500 shrink-0"/>{shop.address}</div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">{shop.catch}</p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 text-xs font-bold"><Banknote size={16} className="text-green-500"/>{shop.budget.name}</div>
                <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-2xl border border-green-500/20 text-xs font-black text-green-400 uppercase"><Utensils size={16}/>{shop.capacity}席</div>
              </div>
              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-black text-center py-5 rounded-[1.5rem] font-black text-xl mt-6 active:scale-[0.97] transition shadow-xl shadow-white/5">予約・詳細をチェック</a>
            </div>
          </div>
        )) : <div className="text-center py-20 text-gray-600 font-black italic text-xl">近くに候補が見つかりませんでした</div>}
      </div>
    </main>
  );
}

export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }

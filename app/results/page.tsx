"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, Utensils, Banknote, Lightbulb } from "lucide-react";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function init() {
      try {
        const sRes = await fetch("/api/suggest", { method: "POST", body: JSON.stringify(Object.fromEntries(params)) });
        const sugg = sRes.ok ? await sRes.json() : { keyword: "居酒屋", reason: "近くのお店をリサーチしました" };
        
        const hRes = await fetch(`/api/shops?lat=${params.get("lat")}&lng=${params.get("lng")}&keyword=${encodeURIComponent(sugg.keyword)}`);
        const shops = await hRes.json();
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) {
        setData(d => ({ ...d, loading: false }));
      }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="w-20 h-20 border-4 border-[#333] rounded-full flex items-center justify-center animate-bounce bg-white shadow-[6px_6px_0px_#FFD700]">
        <Lightbulb size={40} className="text-[#333]" />
      </div>
      <p className="mt-8 text-2xl font-black italic">研究員が調査中...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 p-4 bg-white rounded-2xl border-4 border-[#333] shadow-[4px_4px_0px_#333] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"><ArrowLeft size={24}/></button>
        {data.suggestion && (
          <div className="bg-[#FFEE00] border-4 border-[#333] p-6 rounded-[2.5rem] mb-10 shadow-[8px_8px_0px_#333]">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><Sparkles /> {data.suggestion.keyword}</h2>
            <p className="font-bold text-sm leading-relaxed">{data.suggestion.reason}</p>
          </div>
        )}
        <div className="grid gap-8">
          {data.shops.length > 0 ? data.shops.map((shop: any) => (
            <div key={shop.id} className="bg-white border-4 border-[#333] rounded-[2.5rem] overflow-hidden shadow-[10px_10px_0px_#333]">
              <img src={shop.photo.pc.l} className="w-full h-56 object-cover border-b-4 border-[#333]" alt={shop.name} />
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-black">{shop.name}</h3>
                <div className="flex items-start gap-1 text-gray-500 text-xs font-bold"><MapPin size={14} className="text-[#FFD700]"/>{shop.address}</div>
                <p className="font-bold text-sm text-gray-600 line-clamp-2">{shop.catch}</p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black"><Banknote size={16}/>{shop.budget.name}</div>
                  <div className="flex items-center gap-2 bg-[#FFEE00] px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black uppercase"><Utensils size={16}/>{shop.capacity}席</div>
                </div>
                <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#333] text-white text-center py-5 rounded-2xl font-black text-xl mt-4 shadow-[6px_6px_0px_#FFD700] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">予約・詳細をみる</a>
              </div>
            </div>
          )) : <div className="text-center py-20 font-black text-gray-400 text-2xl italic">NO DATA FOUND...</div>}
        </div>
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }

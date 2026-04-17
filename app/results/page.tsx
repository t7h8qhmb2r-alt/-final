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
      } catch (e) { setData(d => ({ ...d, loading: false })); }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="w-16 h-16 border-4 border-[#333] rounded-full flex items-center justify-center animate-bounce shadow-[4px_4px_0px_#FFD700]"><Lightbulb size={32} className="text-[#333]"/></div>
      <p className="mt-6 text-xl font-black italic text-[#333]">調査中...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-4 pb-12 max-w-2xl mx-auto text-[#333]">
      <button onClick={() => router.back()} className="mb-6 p-3 bg-white rounded-xl border-4 border-[#333] shadow-[4px_4px_0px_#333] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"><ArrowLeft size={24}/></button>
      {data.suggestion && (
        <div className="bg-[#FFEE00] border-4 border-[#333] p-6 rounded-[2rem] mb-8 shadow-[6px_6px_0px_#333]">
          <h2 className="text-xl font-black mb-1 flex items-center gap-2 text-[#333]"><Sparkles size={18}/> {data.suggestion.keyword}</h2>
          <p className="font-bold text-xs opacity-80 text-[#333]">{data.suggestion.reason}</p>
        </div>
      )}
      <div className="grid gap-6">
        {data.shops.map((shop: any) => (
          <div key={shop.id} className="bg-white border-4 border-[#333] rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_#333]">
            <img src={shop.photo.pc.l} className="w-full h-48 object-cover border-b-4 border-[#333]" alt={shop.name} />
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-black text-[#333]">{shop.name}</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><MapPin size={12} className="text-[#FFD700]"/>{shop.address}</div>
              <p className="font-bold text-xs text-gray-600 line-clamp-2">{shop.catch}</p>
              <div className="flex gap-3">
                <div className="bg-[#FFEE00] px-3 py-1 rounded-lg border-2 border-[#333] text-[10px] font-black uppercase text-[#333]">{shop.capacity}席</div>
                <div className="bg-gray-100 px-3 py-1 rounded-lg border-2 border-[#333] text-[10px] font-black text-[#333]">{shop.budget.name}</div>
              </div>
              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#333] text-white text-center py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_#FFD700] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">予約する</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }

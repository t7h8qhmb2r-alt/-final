"use client";
import { useRouter } from "next/navigation";
import { Users, GlassWater, Banknote, Search, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    setLoading(true);
    const go = (lat: string, lng: string) => {
      const params = new URLSearchParams({ ...formData, lat, lng });
      router.push(`/results?${params.toString()}`);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => go(String(p.coords.latitude), String(p.coords.longitude)),
        () => go("35.6812", "139.7671"),
        { timeout: 5000 }
      );
    } else { go("35.6812", "139.7671"); }
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-dot opacity-10 pointer-events-none"></div>
      <div className="max-w-md mx-auto px-6 pt-20 pb-12 relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <div className="w-28 h-28 border-4 border-[#333] rounded-full flex items-center justify-center bg-white shadow-[8px_8px_0px_#FFD700] mb-6">
            <Lightbulb size={56} className="text-[#333]" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter text-[#333] mb-1">2 軒 目</h1>
            <h1 className="text-5xl font-black tracking-tighter text-[#333] mb-2">研究所</h1>
            <div className="h-2 w-full bg-[#FFD700] rounded-full"></div>
          </div>
        </div>

        <div className="w-full space-y-8 bg-white p-8 rounded-[2.5rem] border-4 border-[#333] shadow-[12px_12px_0px_#333]">
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Users className="text-[#333]" size={28} />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-gray-400">Members</p>
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full text-3xl font-black outline-none bg-transparent" />
              </div>
              <span className="font-black text-xl">人</span>
            </div>
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <GlassWater className="text-[#333]" size={28} />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-gray-400">Last Drink</p>
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="w-full text-xl font-black outline-none bg-transparent" placeholder="ビール..." />
              </div>
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading} className="w-full h-20 bg-[#FFEE00] border-4 border-[#333] rounded-2xl font-black text-2xl flex items-center justify-center gap-3 shadow-[6px_6px_0px_#333] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            {loading ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-[#333]" /> : <><Search size={32} strokeWidth={4} /><span>店を探す</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}

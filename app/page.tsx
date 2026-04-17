"use client";
import { useRouter } from "next/navigation";
import { Users, GlassWater, Search, Lightbulb } from "lucide-react";
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
    <main className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 right-0 w-full h-full bg-dot opacity-10 pointer-events-none"></div>
      <div className="max-w-md w-full relative z-10 space-y-12">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-[#333] rounded-full flex items-center justify-center bg-white shadow-[6px_6px_0px_#FFD700] mb-6">
            <Lightbulb size={48} className="text-[#333]" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-[#333]">2軒目研究所</h1>
            <div className="h-1.5 w-full bg-[#FFD700] rounded-full mt-1"></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#333] shadow-[10px_10px_0px_#333] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Users className="text-[#333]" size={24} />
              <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full text-2xl font-black outline-none bg-transparent text-[#333]" />
              <span className="font-black text-[#333]">人</span>
            </div>
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <GlassWater className="text-[#333]" size={24} />
              <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="w-full text-xl font-black outline-none bg-transparent text-[#333]" placeholder="ビール..." />
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading} className="w-full h-16 bg-[#FFEE00] border-4 border-[#333] rounded-xl font-black text-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_#333] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-[#333]">
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-[#333]" /> : <><Search size={24} strokeWidth={4} /><span>店を探す</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}

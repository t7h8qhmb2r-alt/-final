"use client";
import { useRouter } from "next/navigation";
import { Users, GlassWater, Banknote, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    setLoading(true);
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    const go = (lat: string, lng: string) => {
      const params = new URLSearchParams({ ...formData, lat, lng });
      router.push(`/results?${params.toString()}`);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => go(String(p.coords.latitude), String(p.coords.longitude)),
        () => go("35.6812", "139.7671"),
        options
      );
    } else { go("35.6812", "139.7671"); }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-pink-600/10 blur-[120px] rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full animate-spin-slow" style={{animationDirection:'reverse'}}></div>

      <div className="w-full max-w-md z-10 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
            2軒目<span className="text-pink-500 underline decoration-[12px]">。</span>
          </h1>
          <p className="text-gray-400 text-lg font-bold tracking-tight">AIが今、最適な場所を厳選します</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Party Size</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-3xl p-5 border border-white/5 focus-within:border-pink-500/50 transition">
                <Users className="text-pink-500" size={24} />
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="bg-transparent w-full text-2xl font-bold outline-none" />
                <span className="text-gray-500 font-bold">人</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Last Drink</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-3xl p-5 border border-white/5 focus-within:border-blue-500/50 transition">
                <GlassWater className="text-blue-400" size={24} />
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="bg-transparent w-full text-xl font-bold outline-none" placeholder="ビール、日本酒..." />
              </div>
            </div>
          </div>

          <button onClick={handleSearch} disabled={loading} className={`w-full h-24 rounded-[2rem] font-black text-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.95] ${loading ? 'bg-gray-800 text-gray-600' : 'bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-[0_20px_50px_rgba(236,72,153,0.3)]'}`}>
            {loading ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white" /> : <><Search size={32} strokeWidth={3} /><span>探す</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}

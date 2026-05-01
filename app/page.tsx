"use client";
import { useRouter } from "next/navigation";
import { Users, Beer, Search, Lightbulb, Martini, GlassWater, Banknote } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const params = new URLSearchParams({ ...formData, lat: String(p.coords.latitude), lng: String(p.coords.longitude) });
        router.push(`/results?${params.toString()}`);
      },
      () => {
        const params = new URLSearchParams({ ...formData, lat: "35.6812", lng: "139.7671" });
        router.push(`/results?${params.toString()}`);
      },
      { timeout: 5000 }
    );
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-dot opacity-20"></div>
      
      {/* 浮遊するカラフルお酒アイコン */}
      <Beer className="absolute top-[10%] left-[5%] text-yellow-500 opacity-20 animate-float" size={80} />
      <Martini className="absolute top-[15%] right-[10%] text-pink-500 opacity-20 animate-float" style={{animationDelay:'1s'}} size={60} />
      <GlassWater className="absolute bottom-[20%] left-[10%] text-blue-500 opacity-20 animate-float" style={{animationDelay:'2s'}} size={70} />

      <div className="max-w-md w-full relative z-10 space-y-12">
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-[#1A1A1B] rounded-full flex items-center justify-center bg-white shadow-[8px_8px_0px_#FFEE00] mb-6">
            <Lightbulb size={48} className="text-[#1A1A1B]" />
          </div>
          <h1 className="text-5xl font-black text-[#1A1A1B] tracking-tighter">
            2軒目<span className="text-[#FF6B6B]">研究所</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2 tracking-widest text-xs uppercase">Design Your Final Drink</p>
        </div>

        <div className="lab-card p-8 space-y-6">
          <div className="space-y-5">
            <div className="input-block">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Party Size</label>
              <div className="flex items-center gap-3">
                <Users className="text-[#FF6B6B]" size={20} />
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full text-xl font-bold outline-none bg-transparent" />
                <span className="font-bold">名</span>
              </div>
            </div>

            <div className="input-block">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Previous Drink</label>
              <div className="flex items-center gap-3">
                <Beer className="text-[#4ECDC4]" size={20} />
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="w-full text-xl font-bold outline-none bg-transparent" placeholder="ビール..." />
              </div>
            </div>

            <div className="input-block">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Budget per person</label>
              <div className="flex items-center gap-3">
                <Banknote className="text-green-500" size={20} />
                <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full text-xl font-bold outline-none bg-transparent appearance-none">
                  <option value="2000">〜2,000円</option>
                  <option value="3000">〜3,000円</option>
                  <option value="5000">〜5,000円</option>
                  <option value="10000">5,000円以上</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleSearch} disabled={loading} className="w-full h-20 bg-[#FFEE00] border-4 border-[#1A1A1B] rounded-2xl font-black text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0px_#1A1A1B] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            {loading ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-[#1A1A1B]" /> : <><Search size={28} strokeWidth={4} /><span>SEARCH</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}

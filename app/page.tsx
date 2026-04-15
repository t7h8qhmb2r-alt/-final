"use client";
import { useRouter } from "next/navigation";
import { Users, GlassWater, Banknote, Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const params = new URLSearchParams({ ...formData, lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) });
      router.push(`/results?${params.toString()}`);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 tracking-tighter">2軒目。</h1>
          <p className="text-gray-400 mt-2">AIが今の気分で店を選びます</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/20 p-2">
              <Users className="text-pink-400" />
              <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="bg-transparent w-full text-xl outline-none" placeholder="人数" />
            </div>
            <div className="flex items-center gap-3 border-b border-white/20 p-2">
              <GlassWater className="text-blue-400" />
              <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="bg-transparent w-full text-xl outline-none" placeholder="1軒目で飲んだもの" />
            </div>
            <div className="flex items-center gap-3 border-b border-white/20 p-2">
              <Banknote className="text-green-400" />
              <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="bg-transparent w-full text-xl outline-none">
                <option value="2000">~2,000円</option>
                <option value="3000">~3,000円</option>
                <option value="5000">~5,000円</option>
              </select>
            </div>
          </div>
          <button onClick={handleSearch} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 active:scale-95 transition">
            <Search /> 店を探す
          </button>
        </div>
      </div>
    </main>
  );
}

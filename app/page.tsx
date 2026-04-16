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

    // 位置情報の取得（タイムアウト設定を追加）
    const options = {
      enableHighAccuracy: true,
      timeout: 5000, // 5秒待ってダメならエラーへ
      maximumAge: 0
    };

    const success = (pos: any) => {
      const params = new URLSearchParams({ 
        ...formData, 
        lat: String(pos.coords.latitude), 
        lng: String(pos.coords.longitude) 
      });
      router.push(`/results?${params.toString()}`);
    };

    const error = (err: any) => {
      console.warn(`GPS Error (${err.code}): ${err.message}`);
      // GPSが取れない場合は、デフォルト位置（東京駅周辺）で無理やり進む
      const params = new URLSearchParams({ 
        ...formData, 
        lat: "35.6812", 
        lng: "139.7671",
        gps_error: "true" 
      });
      router.push(`/results?${params.toString()}`);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      error({ code: 0, message: "Geolocation not supported" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10 space-y-10 text-white">
        <div className="text-center space-y-2">
          <h1 className="text-7xl font-black italic tracking-tighter">
            2軒目<span className="text-pink-500">。</span>
          </h1>
          <p className="text-gray-400 font-medium">最高の2軒目を、AIが秒で見つける。</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block uppercase tracking-wider">人数</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                <Users className="text-pink-500" size={24} />
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="bg-transparent w-full text-2xl font-bold outline-none text-white" />
              </div>
            </div>
            <div className="group">
              <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block uppercase tracking-wider">さっき飲んだもの</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                <GlassWater className="text-blue-400" size={24} />
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="bg-transparent w-full text-xl font-bold outline-none text-white" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSearch} 
            className={`w-full h-20 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-lg`}
          >
            {loading ? (
              <div className="flex items-center gap-3 italic">
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>分析中...</span>
              </div>
            ) : (
              <>
                <Search size={28} strokeWidth={3} />
                <span>店を探す</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

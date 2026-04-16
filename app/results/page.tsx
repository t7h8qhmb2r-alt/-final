"use client";
import { useRouter } from "next/navigation";
import { Users, GlassWater, Banknote, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    setLoading(true); // ボタンを押した瞬間にローディング開始！

    if (!navigator.geolocation) {
      alert("位置情報が使えません。ブラウザの設定を確認してください。");
      setLoading(false);
      return;
    }

    // タイムアウトを設定して、GPSが遅い場合でも次へ進む
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const params = new URLSearchParams({ 
          ...formData, 
          lat: String(pos.coords.latitude), 
          lng: String(pos.coords.longitude) 
        });
        router.push(`/results?${params.toString()}`);
      },
      (error) => {
        console.error(error);
        alert("位置情報の取得に失敗しました。スカイツリー周辺で検索します。");
        // 失敗時のデフォルト位置（例：スカイツリー）
        const params = new URLSearchParams({ ...formData, lat: "35.7100", lng: "139.8107" });
        router.push(`/results?${params.toString()}`);
      },
      { timeout: 10000 }
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-pink-400 text-xs font-bold tracking-widest uppercase mb-2 border border-white/10">
            AI-Powered Finder
          </div>
          <h1 className="text-7xl font-black italic text-white tracking-tighter">
            2軒目<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">。</span>
          </h1>
          <p className="text-gray-400 font-medium">今の気分に、最高の一軒を。</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block uppercase tracking-wider">Members</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group-focus-within:border-pink-500/50 transition">
                <Users className="text-pink-500" size={24} />
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="bg-transparent w-full text-2xl font-bold outline-none text-white" />
                <span className="text-gray-500 font-bold">人</span>
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block uppercase tracking-wider">1st Drink</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group-focus-within:border-blue-500/50 transition">
                <GlassWater className="text-blue-400" size={24} />
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="bg-transparent w-full text-xl font-bold outline-none text-white" placeholder="日本酒、ビールなど" />
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block uppercase tracking-wider">Budget</label>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group-focus-within:border-green-500/50 transition">
                <Banknote className="text-green-400" size={24} />
                <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="bg-transparent w-full text-xl font-bold outline-none text-white appearance-none">
                  <option value="2000">~2,000円</option>
                  <option value="3000">~3,000円</option>
                  <option value="5000">~5,000円</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSearch} 
            disabled={loading}
            className={`w-full relative overflow-hidden h-20 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${loading ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-[0_0_40px_rgba(236,72,153,0.3)]'}`}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>思考中...</span>
              </div>
            ) : (
              <>
                <Search size={28} strokeWidth={3} />
                <span>店を探す</span>
                <Sparkles className="absolute top-2 right-4 opacity-50" size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

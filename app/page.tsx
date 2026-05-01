import React from 'react';
import { Terminal, Search, Settings, Compass, Heart, ReceiptText } from 'lucide-react';

const HomePage = () => {
  return (
    <main className="min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#1A1B26] border-b-2 border-[#414868] shadow-[4px_4px_0px_0px_rgba(26,27,38,0.5)]">
        <div className="flex items-center gap-2">
          <div className="bg-[#FFEE00] text-black px-2 py-1 font-black italic border-2 border-black">
            BAR_LAB.EXE
          </div>
        </div>
        <div className="flex gap-4 text-[#2DD4BF]">
          <Terminal size={24} />
          <Settings size={24} />
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-6 space-y-8">
        {/* Status Badge */}
        <div className="inline-block px-3 py-1 bg-[#2DD4BF]/20 border border-[#2DD4BF] text-[#2DD4BF] text-xs font-bold tracking-widest uppercase">
          STATUS: READY TO SCAN
        </div>

        {/* Hero Title */}
        <section className="space-y-4">
          <h1 className="text-5xl font-black font-space-grotesk tracking-tighter leading-none">
            「AIスキャン開始」
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            次世代ラボラトリー・プロトコルへようこそ。予算とパラメータを入力して、最適な検体とデータを瞬時に抽出します。
          </p>
        </section>

        {/* Search Form Card */}
        <div className="lab-card p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#2DD4BF] tracking-widest uppercase">検体タイプ / SPECIMEN TYPE</label>
            <div className="relative">
              <select className="w-full bg-[#0e1224] border-2 border-[#414868] p-4 text-white appearance-none focus:border-[#2DD4BF] outline-none">
                <option>すべてのカテゴリ</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#2DD4BF] tracking-widest uppercase">予算設定（円）</label>
            <div className="flex items-center bg-[#0e1224] border-2 border-[#414868] p-4">
              <input type="text" placeholder="0 - 1,000,000" className="bg-transparent w-full text-white outline-none" />
              <span className="text-slate-500 font-bold ml-2">JPY</span>
            </div>
          </div>

          <button className="w-full bg-[#2DD4BF] text-black font-black py-4 flex items-center justify-center gap-2 hover:bg-[#26b8a5] transition-colors shadow-[4px_4px_0px_0px_#000]">
            <Search size={20} />
            検体を検索 (SCAN)
          </button>
        </div>

        {/* Animated Scanner Preview */}
        <div className="relative h-64 border-2 border-[#414868] overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-[#0e1224]/40"></div>
          <div className="absolute inset-0 animate-scan"></div>
          <div className="absolute top-4 left-4 bg-black/60 border border-[#2DD4BF] p-2 text-[10px] font-mono text-[#2DD4BF]">
            LAT: 35.6895 N<br />LNG: 139.6917 E
          </div>
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="h-1 bg-[#414868] w-full">
              <div className="h-full bg-[#2DD4BF] w-[68%]"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-[#2DD4BF]">
              <span>SCANNING PROGRESS</span>
              <span>68%</span>
            </div>
          </div>
        </div>

        {/* Recent Analysis Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-px bg-[#414868]"></div>
             <h2 className="text-[10px] font-bold text-[#2DD4BF] tracking-widest uppercase">LATEST_SCAN_DATA</h2>
          </div>
          <h3 className="text-2xl font-black">最近の検体解析結果</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1b26] border-2 border-[#414868] p-4 space-y-1">
              <span className="text-[#2DD4BF] text-xs font-mono">#0042</span>
              <p className="font-bold">神経回路コア</p>
            </div>
            <div className="bg-[#1a1b26] border-2 border-[#414868] p-4 space-y-1">
              <span className="text-[#2DD4BF] text-xs font-mono">#0051</span>
              <p className="font-bold">分子同期装置</p>
            </div>
          </div>
        </section>

        {/* Emergency Alert */}
        <div className="bg-[#FFEE00]/10 border-2 border-[#FFEE00] p-6 text-center space-y-2">
          <div className="text-[#FFEE00] flex justify-center"><Terminal size={32} /></div>
          <h4 className="text-[#FFEE00] font-black text-xl">緊急指令</h4>
          <p className="text-[#FFEE00]/80 text-xs">未承認のアクセスを検知しました。プロトコル22を適用してください。</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#1A1B26] border-t-2 border-[#414868] h-20 px-6 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Compass size={24} />
          <span className="text-[10px] font-bold">EXPLORE</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-[#FFEE00] text-black px-4 py-1 rounded-sm">
          <Search size={24} />
          <span className="text-[10px] font-bold">SEARCH</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Heart size={24} />
          <span className="text-[10px] font-bold">SAVED</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <ReceiptText size={24} />
          <span className="text-[10px] font-bold">LOGS</span>
        </div>
      </nav>
    </main>
  );
};

export default HomePage;

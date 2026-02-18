import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Users, Heart, Sparkles, Map, Ghost, Palette, Briefcase, Zap } from 'lucide-react';
import LZString from 'lz-string';

const MONTHS = [
  'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26',
  'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27'
];

const PHASES = [
  { id: 'love', label: 'In Love ❤️', color: 'bg-gradient-to-br from-rose-400 to-pink-500', icon: Heart },
  { id: 'island', label: 'Island Move 🏝️', color: 'bg-gradient-to-br from-sky-400 to-blue-500', icon: Map },
  { id: 'existential', label: 'Existential Crisis 🌀', color: 'bg-gradient-to-br from-indigo-500 to-violet-600', icon: Zap },
  { id: 'workaholic', label: 'Corporate Grinder 💼', color: 'bg-gradient-to-br from-slate-600 to-slate-800', icon: Briefcase },
  { id: 'artist', label: 'Tortured Artist 🎨', color: 'bg-gradient-to-br from-orange-400 to-amber-500', icon: Palette },
  { id: 'cult', label: 'Joining a Cult 🕯️', color: 'bg-gradient-to-br from-emerald-500 to-teal-700', icon: Sparkles },
  { id: 'vanish', label: 'Ghosting Everyone 👻', color: 'bg-gradient-to-br from-slate-300 to-slate-400', icon: Ghost },
];

function App() {
  const [userName, setUserName] = useState('');
  const [timeline, setTimeline] = useState(Array(12).fill('love'));
  const [comparisons, setComparisons] = useState([]);
  const [view, setView] = useState('editor'); 
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#data=')) {
      try {
        const compressed = hash.replace('#data=', '');
        const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
        const data = JSON.parse(decompressed);
        if (data.name && data.timeline) {
          setUserName(data.name);
          setTimeline(data.timeline);
        }
      } catch (e) { console.error(e); }
    } else if (hash.startsWith('#pit=')) {
      try {
        const compressed = hash.replace('#pit=', '');
        const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
        const data = JSON.parse(decompressed);
        if (data.isPit && data.comparisons) {
          setComparisons(data.comparisons);
          setView('compare');
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  const generateShareUrl = () => {
    const data = JSON.stringify({ name: userName || 'Someone', timeline });
    const compressed = LZString.compressToEncodedURIComponent(data);
    const url = `${window.location.origin}${window.location.pathname}#data=${compressed}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generatePitShareUrl = () => {
    const data = JSON.stringify({ isPit: true, comparisons });
    const compressed = LZString.compressToEncodedURIComponent(data);
    const url = `${window.location.origin}${window.location.pathname}#pit=${compressed}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const addToComparison = () => {
    const hash = window.location.hash;
    let newComp;
    if (hash.startsWith('#data=')) {
      const compressed = hash.replace('#data=', '');
      const data = JSON.parse(LZString.decompressFromEncodedURIComponent(compressed));
      newComp = { ...data, id: compressed };
    } else {
      newComp = { name: userName || 'Me', timeline, id: Math.random().toString(36).substr(2, 9) };
    }
    if (!comparisons.find(c => c.id === newComp.id)) {
      setComparisons([...comparisons, newComp]);
    }
  };

  const removeComparison = (id) => setComparisons(comparisons.filter(c => c.id !== id));

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center animate-wiggle">
        <div className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-rose-200 shadow-sm">
          Phase Predictor v2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-sky-500 leading-tight">
          MARIA'S FATE
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
          The official betting ground for Maria's chaotic 2026/27 timeline.
        </p>
      </header>

      <nav className="flex justify-center p-1 bg-white/40 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-10 border border-white/50 shadow-inner">
        <button 
          onClick={() => setView('editor')}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${view === 'editor' ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setView('compare')}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === 'compare' ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Users size={16} />
          The Pit
        </button>
      </nav>

      <main className="relative">
        {view === 'editor' ? (
          <div className="glass-card rounded-[2.5rem] p-6 md:p-12 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={200} />
             </div>
             
            <div className="mb-12 relative z-10">
              <span className="block text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">Predictor Identity</span>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Who are you?"
                className="w-full text-3xl font-black bg-transparent border-b-4 border-rose-100 focus:border-rose-400 outline-none pb-4 transition-all placeholder:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 relative z-10">
              {MONTHS.map((month, idx) => {
                const currentPhase = PHASES.find(p => p.label === timeline[idx]) || { color: 'bg-white', icon: Heart };
                const Icon = currentPhase.icon;
                return (
                  <div key={idx} className="bg-white/50 border border-white p-4 rounded-3xl group hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">{month}</span>
                      <Icon className="text-slate-200 group-hover:text-rose-300 transition-colors" size={14} />
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={timeline[idx]}
                        onChange={(e) => {
                          const nt = [...timeline];
                          nt[idx] = e.target.value;
                          setTimeline(nt);
                        }}
                        placeholder="What's the vibe?"
                        className="w-full p-3 rounded-xl font-black text-slate-700 text-xs bg-white border-2 border-slate-50 focus:border-rose-300 outline-none transition-all shadow-sm"
                      />
                      <div className="flex flex-wrap gap-1">
                        {PHASES.slice(0, 4).map(p => (
                          <button 
                            key={p.id}
                            onClick={() => {
                              const nt = [...timeline];
                              nt[idx] = p.label;
                              setTimeline(nt);
                            }}
                            className={`w-6 h-6 rounded-lg ${p.color} border-2 border-white shadow-sm hover:scale-110 transition-transform`}
                            title={p.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 relative z-10">
              <button 
                onClick={generateShareUrl}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black hover:bg-slate-800 transition shadow-xl shadow-slate-200"
              >
                <Share2 size={20} className={copySuccess ? 'animate-bounce' : ''} />
                {copySuccess ? 'LINK SNAGGED!' : 'SHARE YOUR TRUTH'}
              </button>

              <button 
                onClick={() => { addToComparison(); setView('compare'); }}
                className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-[2rem] font-black hover:bg-slate-50 transition border border-slate-100 shadow-lg shadow-pink-100/50"
              >
                <Plus size={20} />
                ENTER THE PIT
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card rounded-[2.5rem] p-6 md:p-8 overflow-x-auto custom-scrollbar">
              <div className="min-w-[900px]">
                <div className="flex mb-8 items-center px-4">
                  <div className="w-48 text-xs font-black text-slate-300 uppercase tracking-widest">Friends Group</div>
                  <div className="flex flex-1 gap-2">
                    {MONTHS.map(m => (
                      <div key={m} className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-50">{m}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {comparisons.length === 0 ? (
                    <div className="text-center py-24 text-slate-300 italic font-medium bg-white/30 rounded-[2rem] border-2 border-dashed border-white/50">
                      The pit is quiet... too quiet. Add some timelines!
                    </div>
                  ) : (
                    comparisons.map((comp) => (
                      <div key={comp.id} className="flex items-center group bg-white/40 p-2 rounded-[1.5rem] border border-white hover:bg-white/60 transition-colors">
                        <div className="w-48 flex-shrink-0 flex items-center gap-3 pr-4 pl-2">
                          <button onClick={() => removeComparison(comp.id)} className="text-slate-200 hover:text-rose-500 transition-colors bg-white rounded-full p-1.5 shadow-sm">
                            <Trash2 size={12} />
                          </button>
                          <span className="font-black text-slate-700 truncate text-sm uppercase tracking-tight">{comp.name}</span>
                        </div>
                        <div className="flex flex-1 gap-2">
                          {comp.timeline.map((text, i) => {
                            const phase = PHASES.find(p => p.label === text) || { color: 'bg-slate-100 border-slate-200' };
                            return (
                              <div 
                                key={i} 
                                title={text}
                                className={`flex-1 h-14 rounded-xl ${phase.color} shadow-sm transition hover:scale-110 hover:z-10 border-2 border-white flex items-center justify-center`}
                              >
                                <span className="text-[8px] font-black text-white px-1 text-center leading-tight truncate drop-shadow-sm">{text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {comparisons.length > 0 && (
                  <div className="mt-12 flex justify-center pt-4">
                    <button 
                      onClick={generatePitShareUrl}
                      className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-indigo-600 text-white px-10 py-5 rounded-full font-black hover:scale-105 active:scale-95 transition shadow-xl shadow-rose-200"
                    >
                      <Share2 size={20} />
                      {copySuccess ? 'PIT LINK SAVED!' : 'SHARE THIS PIT'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/40 border border-white p-8 rounded-[2rem]">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-rose-400" />
                    How to Play
                  </h3>
                  <ul className="space-y-3 text-slate-500 text-sm font-medium">
                    <li className="flex gap-3"><span className="text-rose-400 font-black">1.</span> Craft your prediction in the Editor.</li>
                    <li className="flex gap-3"><span className="text-rose-400 font-black">2.</span> Copy your link and send it to the group.</li>
                    <li className="flex gap-3"><span className="text-rose-400 font-black">3.</span> Click "Enter the Pit" to compare with others.</li>
                  </ul>
               </div>
               <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" />
                    No Servers.
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Everything is stored in the URL. We don't save your data, we just vibing. Your link IS your save file.
                  </p>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 text-center pb-12">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Built for Maria & Friends • Volatility is our middle name
        </p>
        <div className="flex justify-center gap-2">
           {[...Array(5)].map((_, i) => (
             <Heart key={i} size={10} className="text-rose-200 fill-rose-200" />
           ))}
        </div>
      </footer>
    </div>
  );
}

export default App;

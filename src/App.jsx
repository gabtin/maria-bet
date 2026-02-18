import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Users, Heart, Sparkles, Map, Ghost, Palette, Briefcase, Zap, RefreshCw } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize client from window
  const getSupabase = () => {
    if (window.supabase) {
      return window.supabase.createClient(
        'https://dtoahvrajhjytmjhurjb.supabase.co',
        'sb_publishable_ngyKixxJIvDfeS9EdMT7sw_GkcBdF7K'
      );
    }
    return null;
  };

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      // Small delay if CDN hasn't loaded yet
      setTimeout(fetchPredictions, 500);
      return;
    }
    
    fetchPredictions();
    
    const subscription = sb
      .channel('public:maria_predictions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maria_predictions' }, fetchPredictions)
      .subscribe();

    return () => {
      sb.removeChannel(subscription);
    };
  }, []);

  const fetchPredictions = async () => {
    const sb = getSupabase();
    if (!sb) return;

    setLoading(true);
    const { data, error } = await sb
      .from('maria_predictions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching:', error);
    else setComparisons(data || []);
    setLoading(false);
  };

  const submitPrediction = async () => {
    const sb = getSupabase();
    if (!sb) {
      alert("Database connection not ready yet, try again in a sec!");
      return;
    }

    if (!userName.trim()) {
      alert("Please enter your name first!");
      return;
    }

    setLoading(true);
    const { error } = await sb
      .from('maria_predictions')
      .insert([{ name: userName, timeline }]);

    if (error) {
      alert("Error saving prediction: " + error.message);
    } else {
      setUserName('');
      setTimeline(Array(12).fill('love'));
      setView('compare');
      fetchPredictions();
    }
    setLoading(false);
  };

  const getPhaseColor = (text) => {
    const phase = PHASES.find(p => p.label === text);
    if (phase) return phase.color;
    const colors = [
      'bg-gradient-to-br from-pink-300 to-rose-400',
      'bg-gradient-to-br from-purple-300 to-indigo-400',
      'bg-gradient-to-br from-cyan-300 to-sky-400',
      'bg-gradient-to-br from-emerald-300 to-teal-400',
      'bg-gradient-to-br from-amber-300 to-orange-400',
      'bg-gradient-to-br from-fuchsia-300 to-pink-400'
    ];
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center animate-wiggle">
        <div className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-rose-200 shadow-sm">
          Live Maria Tracker
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-sky-500 leading-tight">
          MARIA'S FATE
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
          The global leaderboard for Maria's chaotic timeline.
        </p>
      </header>

      <nav className="flex justify-center p-1 bg-white/40 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-10 border border-white/50 shadow-inner relative">
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
        {loading && (
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-rose-400 animate-spin">
            <RefreshCw size={20} />
          </div>
        )}
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
                const colorClass = getPhaseColor(timeline[idx]);
                const currentPhase = PHASES.find(p => p.label === timeline[idx]);
                const Icon = currentPhase?.icon || Heart;
                return (
                  <div key={idx} className={`border border-white p-4 rounded-3xl group hover:shadow-lg transition-all hover:-translate-y-1 ${colorClass.includes('gradient') ? 'bg-white/40' : 'bg-white/50'}`}>
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
                        className={`w-full p-3 rounded-xl font-black text-xs outline-none transition-all shadow-md border-2 border-white ${colorClass} text-white placeholder:text-white/60`}
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
                onClick={submitPrediction}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black hover:bg-slate-800 transition shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                <Plus size={20} />
                {loading ? 'SYNCING...' : 'PUBLISH TO THE PIT'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card rounded-[2.5rem] p-6 md:p-8 overflow-x-auto custom-scrollbar">
              <div className="min-w-[900px]">
                <div className="flex mb-8 items-center px-4">
                  <div className="w-48 text-xs font-black text-slate-300 uppercase tracking-widest">Global Predictions</div>
                  <div className="flex flex-1 gap-2">
                    {MONTHS.map(m => (
                      <div key={m} className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-50">{m}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {comparisons.length === 0 ? (
                    <div className="text-center py-24 text-slate-300 italic font-medium bg-white/30 rounded-[2rem] border-2 border-dashed border-white/50">
                      {loading ? 'Loading the chaos...' : 'The pit is quiet. Be the first to predict!'}
                    </div>
                  ) : (
                    comparisons.map((comp) => (
                      <div key={comp.id} className="flex items-center group bg-white/40 p-2 rounded-[1.5rem] border border-white hover:bg-white/60 transition-colors">
                        <div className="w-48 flex-shrink-0 flex items-center gap-3 pr-4 pl-2">
                          <span className="font-black text-slate-700 truncate text-sm uppercase tracking-tight">{comp.name}</span>
                        </div>
                        <div className="flex flex-1 gap-2">
                          {comp.timeline.map((text, i) => {
                            const colorClass = getPhaseColor(text);
                            return (
                              <div 
                                key={i} 
                                title={text}
                                className={`flex-1 h-14 rounded-xl ${colorClass} shadow-sm transition hover:scale-110 hover:z-10 border-2 border-white flex items-center justify-center overflow-hidden`}
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
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" />
                    Global Sync Active
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    Every prediction published here is visible to all friends in real-time.
                  </p>
               </div>
               <button 
                  onClick={fetchPredictions}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
               >
                 <RefreshCw size={14} /> Refresh Pit
               </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 text-center pb-12">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Built for Maria & Friends • Live Database Edition
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

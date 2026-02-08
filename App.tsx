
import React, { useState } from 'react';
import { analyzePdf, predictStock } from './services/geminiService';
import { AppState } from './types';
import ResultDashboard from './components/ResultDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    stockResult: null,
    error: null,
    fileName: null,
    activeMode: 'doc',
  });

  const [ticker, setTicker] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null, fileName: file.name }));
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await analyzePdf(base64Data, file.type);
        setState(prev => ({ ...prev, isAnalyzing: false, result: res }));
      };
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const handleStockAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const res = await predictStock(ticker);
      setState(prev => ({ ...prev, isAnalyzing: false, stockResult: res }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const reset = () => setState({
    isAnalyzing: false, result: null, stockResult: null, error: null, fileName: null, activeMode: state.activeMode
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <nav className="flex justify-center mb-12">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          <button 
            onClick={() => { reset(); setState(s => ({...s, activeMode: 'doc'})); }}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${state.activeMode === 'doc' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            PDF ANALYZER
          </button>
          <button 
            onClick={() => { reset(); setState(s => ({...s, activeMode: 'stock'})); }}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${state.activeMode === 'stock' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            MARKET INTEL
          </button>
        </div>
      </nav>

      <header className="text-center mb-16 space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tighter">
          ANTIGRAVITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">INTELLIGENCE</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">
          High-dimensional analysis for high-stakes decisions. Verify documents or predict markets with real-time grounding.
        </p>
      </header>

      <main className="min-h-[400px]">
        {state.isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="w-24 h-24 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white animate-pulse">Scanning Dimensions...</div>
              <div className="text-slate-500 text-sm mt-2">Accessing Neural Search & Grounding</div>
            </div>
          </div>
        ) : (state.result || state.stockResult) ? (
          <ResultDashboard result={state.result} stockResult={state.stockResult} onReset={reset} />
        ) : (
          <div className="max-w-2xl mx-auto">
            {state.activeMode === 'doc' ? (
              <div className="antigravity-glass p-12 rounded-[3rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 transition-all text-center group">
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="relative z-0">
                  <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-pdf text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Initialize Document Scan</h3>
                  <p className="text-slate-500 mt-2">Upload PDF to begin deep semantic interpretation</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStockAnalyze} className="antigravity-glass p-12 rounded-[3rem] space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">Market Prediction Engine</h3>
                  <p className="text-slate-500 mt-2">Enter any stock symbol for real-time intelligence</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={ticker} 
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. NVDA, AAPL, BTC"
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-2xl font-bold text-center text-white focus:outline-none focus:border-indigo-500/50 uppercase tracking-widest placeholder:text-slate-700"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                  GENERATE PREDICTION
                </button>
              </form>
            )}
            {state.error && <div className="mt-8 text-center text-rose-400 font-bold bg-rose-400/10 p-4 rounded-xl border border-rose-400/20">{state.error}</div>}
          </div>
        )}
      </main>

      <footer className="mt-24 border-t border-white/5 pt-12 text-center text-slate-600">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Gravity-Defying Neural Processing</div>
        <p className="text-xs">Proprietary logic powered by Gemini 3 Pro • Real-time Grounding v4.2</p>
      </footer>
    </div>
  );
};

export default App;

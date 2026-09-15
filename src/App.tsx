import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MemoryWall } from './components/MemoryWall';
import { LettersSection } from './components/LettersSection';
import { MiniGamesSection } from './components/MiniGamesSection';
import { TriviaSection } from './components/TriviaSection';
import { setSoundMuted, getSoundMuted, playLevelUp } from './utils/soundEffects';
import { Sparkles, Heart, Gift, BookOpen, Star, Trophy, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mural' | 'cartinhas' | 'jogos' | 'vocesabia'>('mural');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initial celebration burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-halftone flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Header and Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        {/* Intro Birthday Card / Fire Red Trainer Card */}
        <div className="mb-8 bg-white rounded-3xl p-5 sm:p-7 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Trainer Avatar & Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 border-3 border-slate-900 flex items-center justify-center text-4xl sm:text-5xl shadow-md">
                  🧢🌿
                </div>
                <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-pixel text-[9px] px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-xs font-bold">
                  LVL 22
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-comic text-xs px-2.5 py-0.5 rounded-full uppercase">
                    TREINADOR OFICIAL
                  </span>
                  <span className="text-xs font-pixel text-slate-500">Kanto ID: #220918</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-comic text-slate-950 mt-0.5">
                  OTÁVIO MEDEIROS QUEIRÓS
                </h2>
                <p className="text-xs sm:text-sm font-recreio font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <span>🍃 Companheiro: Bulbassauro #001</span>
                  <span>•</span>
                  <span>📖 Escritor de Best-Sellers Secretos</span>
                </p>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
              <div className="bg-amber-50 px-3 py-2 rounded-2xl border-2 border-amber-300 flex items-center gap-2 text-xs font-recreio font-bold text-amber-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>22 Anos Completos!</span>
              </div>

              <div className="bg-rose-50 px-3 py-2 rounded-2xl border-2 border-rose-300 flex items-center gap-2 text-xs font-recreio font-bold text-rose-900">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>12 Cartas com Amor</span>
              </div>

              <div className="bg-emerald-50 px-3 py-2 rounded-2xl border-2 border-emerald-300 flex items-center gap-2 text-xs font-recreio font-bold text-emerald-900">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>8 Curiosidades Pokédex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Section Switcher */}
        {activeTab === 'mural' && <MemoryWall />}
        {activeTab === 'cartinhas' && <LettersSection />}
        {activeTab === 'jogos' && <MiniGamesSection />}
        {activeTab === 'vocesabia' && <TriviaSection />}
      </main>

      {/* Revista Recreio Back Cover / Footer */}
      <footer className="mt-16 bg-[#1e293b] text-white border-t-4 border-slate-900 pt-10 pb-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Recreio Stamp */}
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 font-comic text-sm px-4 py-1.5 rounded-full border-2 border-white shadow-md">
            <Gift className="w-4 h-4 text-red-600" />
            <span>EDIÇÃO HISTÓRICA DE COLECIONADOR • REVISTA RECREIO & POKÉMON FIRE RED</span>
          </div>

          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-comic tracking-wider text-white">
              FELIZ 22 ANOS, OTÁVIO! 🎉
            </h3>
            <p className="text-xs sm:text-sm font-recreio text-slate-300 mt-2 leading-relaxed">
              Que esse novo ciclo de 22 anos seja cheio de saúde, livros publicados no topo das listas, sábados lendários de RPG, doces raros para continuar evoluindo, amor infinito e a certeza de que você sempre terá um lugar especial para voltar!
            </p>
          </div>

          {/* Credits of who made and wrote */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border-2 border-slate-700 max-w-2xl w-full">
            <p className="text-[11px] font-pixel text-amber-300 mb-2 uppercase">
              ★ COM MUITO CARINHO DE TODA A SUA EQUIPE DE TREINADORES ★
            </p>
            <p className="font-recreio font-bold text-xs sm:text-sm text-slate-200">
              Evy (Sua Malvada Favorita) • Mamãe • Oliver • Memel • Didi • Keven • Vini • Kayk • Edgard • Matheus • GL • Lucas
            </p>
          </div>

          {/* Retro Barcode & Copyright joke */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-t border-slate-800 pt-6 text-xs text-slate-400 font-recreio">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-slate-500">BARCODE:</span>
              <span className="font-mono tracking-widest bg-white text-slate-900 px-2 py-0.5 rounded font-bold">
                ||| | |||| || ||| 220918-BULBA
              </span>
            </div>

            <p>© 2026 Otávio Medeiros Queirós • Edição Comemorativa Fire Red 22 Anos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

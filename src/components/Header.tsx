import React from 'react';
import { Volume2, VolumeX, Sparkles, Gamepad2, Mail, Image as ImageIcon, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSelect, playLevelUp } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: 'mural' | 'cartinhas' | 'jogos' | 'vocesabia';
  setActiveTab: (tab: 'mural' | 'cartinhas' | 'jogos' | 'vocesabia') => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  toggleMute,
}) => {
  const triggerConfetti = () => {
    playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
    });
  };

  const handleTabClick = (tab: 'mural' | 'cartinhas' | 'jogos' | 'vocesabia') => {
    playSelect();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#d92822] text-white shadow-xl border-b-4 border-[#881410]">
      {/* Top Revista Recreio Banner Stripe */}
      <div className="bg-[#facc15] text-[#854d0e] px-4 py-1 text-xs sm:text-sm font-recreio font-extrabold flex items-center justify-between tracking-wide border-b-2 border-[#ca8a04]">
        <div className="flex items-center gap-2">
          <span className="bg-[#dc2626] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-comic">
            Edição Especial #22
          </span>
          <span className="hidden sm:inline">REVISTA RECREIO & POKÉMON FIRE RED APRESENTAM:</span>
          <span className="sm:hidden">REVISTA RECREIO & POKÉMON</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline bg-white/70 px-2 py-0.5 rounded text-[11px] text-slate-800">
            ★ BRINDE GRÁTIS: CARINHO DOS AMIGOS ★
          </span>
          <span className="text-red-700 font-comic text-sm">LVL 22 DESBLOQUEADO!</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Otávio Header */}
        <div className="flex items-center gap-3">
          {/* Pokeball Logo Icon */}
          <div className="relative w-12 h-12 bg-white rounded-full border-4 border-slate-900 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#dc2626]"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-900"></div>
            <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-comic tracking-wider text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                OTÁVIO <span className="text-[#fde047]">LV. 22</span>
              </h1>
              <span className="bg-[#15803d] text-[#bbf7d0] text-[10px] sm:text-xs font-pixel px-2 py-0.5 rounded border border-[#166534]">
                #001 BULBA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-100 font-recreio font-medium">
              Feliz Aniversário! O Mestre dos Livros, Risadas e RPG 🎂
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            id="btn-toggle-sound"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-red-800/80 hover:bg-red-900 text-amber-200 border-2 border-red-950 transition-colors flex items-center gap-1.5 text-xs font-recreio font-bold"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Efeitos'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />}
            <span className="hidden sm:inline">{isMuted ? 'Mudo' : '8-bit Som'}</span>
          </button>

          <button
            id="btn-fire-confetti"
            onClick={triggerConfetti}
            className="px-3 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 border-2 border-[#a16207] shadow-md transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-recreio font-extrabold"
          >
            <Sparkles className="w-4 h-4 text-red-600 animate-bounce" />
            <span>Parabéns! 🎉</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Cartridge / Recreio Badges) */}
      <nav className="bg-[#b91c1c] border-t-2 border-[#991b1b] px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-1 sm:gap-3 overflow-x-auto py-2 no-scrollbar">
          <button
            id="nav-mural"
            onClick={() => handleTabClick('mural')}
            className={`px-3 sm:px-5 py-1.5 rounded-t-lg font-recreio font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 border-t-2 border-x-2 ${
              activeTab === 'mural'
                ? 'bg-[#fcf8f2] text-[#b91c1c] border-slate-900 shadow-sm -mb-2 pb-3.5 z-10'
                : 'bg-red-800/70 text-red-100 hover:bg-red-700/80 border-red-950'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Mural de Memórias</span>
          </button>

          <button
            id="nav-cartinhas"
            onClick={() => handleTabClick('cartinhas')}
            className={`px-3 sm:px-5 py-1.5 rounded-t-lg font-recreio font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 border-t-2 border-x-2 ${
              activeTab === 'cartinhas'
                ? 'bg-[#fcf8f2] text-[#b91c1c] border-slate-900 shadow-sm -mb-2 pb-3.5 z-10'
                : 'bg-red-800/70 text-red-100 hover:bg-red-700/80 border-red-950'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Sessão de Cartinhas</span>
            <span className="bg-amber-400 text-slate-900 text-[10px] font-pixel px-1.5 py-0.2 rounded-full">
              12
            </span>
          </button>

          <button
            id="nav-jogos"
            onClick={() => handleTabClick('jogos')}
            className={`px-3 sm:px-5 py-1.5 rounded-t-lg font-recreio font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 border-t-2 border-x-2 ${
              activeTab === 'jogos'
                ? 'bg-[#fcf8f2] text-[#b91c1c] border-slate-900 shadow-sm -mb-2 pb-3.5 z-10'
                : 'bg-red-800/70 text-red-100 hover:bg-red-700/80 border-red-950'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Jogos & Batalha</span>
            <span className="bg-green-400 text-slate-950 text-[10px] font-pixel px-1.5 py-0.2 rounded-full">
              NOVO
            </span>
          </button>

          <button
            id="nav-vocesabia"
            onClick={() => handleTabClick('vocesabia')}
            className={`px-3 sm:px-5 py-1.5 rounded-t-lg font-recreio font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 border-t-2 border-x-2 ${
              activeTab === 'vocesabia'
                ? 'bg-[#fcf8f2] text-[#b91c1c] border-slate-900 shadow-sm -mb-2 pb-3.5 z-10'
                : 'bg-red-800/70 text-red-100 hover:bg-red-700/80 border-red-950'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Você Sabia?</span>
            <span className="bg-yellow-300 text-slate-950 text-[10px] font-pixel px-1.5 py-0.2 rounded-full">
              8/8
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

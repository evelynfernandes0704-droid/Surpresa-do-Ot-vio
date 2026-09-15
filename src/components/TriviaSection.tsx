import React, { useState } from 'react';
import { HelpCircle, Sparkles, Heart, Mic, Feather, BookMarked, Crown, Smile, Flower2, CheckCircle2, Trophy, Volume2 } from 'lucide-react';
import { triviaData } from '../data/triviaData';
import { playSelect, playLevelUp } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5 text-red-500 fill-red-500" />,
  Mic: <Mic className="w-5 h-5 text-pink-500" />,
  Feather: <Feather className="w-5 h-5 text-indigo-500" />,
  BookMarked: <BookMarked className="w-5 h-5 text-amber-500" />,
  Crown: <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />,
  Smile: <Smile className="w-5 h-5 text-orange-500" />,
  Flower2: <Flower2 className="w-5 h-5 text-emerald-500" />,
};

export const TriviaSection: React.FC = () => {
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([1]); // 1 already known

  const handleDiscover = (id: number) => {
    playSelect();
    if (!discoveredIds.includes(id)) {
      const updated = [...discoveredIds, id];
      setDiscoveredIds(updated);
      if (updated.length === triviaData.length) {
        playLevelUp();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'],
        });
      }
    }
  };

  const handleRevealAll = () => {
    playLevelUp();
    setDiscoveredIds(triviaData.map((t) => t.id));
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Revista Recreio */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-3xl p-6 sm:p-8 text-slate-950 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white font-pixel text-[11px] sm:text-xs px-3 py-1 rounded-full mb-3 border-2 border-slate-900 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
            <span>SEÇÃO OFICIAL REVISTA RECREIO & POKÉDEX</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-comic tracking-wider text-slate-950 leading-tight">
            VOCÊ SABIA? FATOS LENDÁRIOS SOBRE O ANIVERSARIANTE!
          </h2>
          <p className="text-sm sm:text-base font-recreio font-semibold text-slate-800 mt-2">
            Desvende os segredos, os golpes secretos, os livros que nunca saem do rascunho e a paixão inabalável pelo Bulbassauro #001! Clique nos cards para registrar na sua Pokédex.
          </p>

          {/* Progress Tracker */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-xs flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-recreio font-extrabold text-xs sm:text-sm text-slate-900">
                Coleção: {discoveredIds.length} de {triviaData.length} Descobertas!
              </span>
            </div>

            {discoveredIds.length < triviaData.length && (
              <button
                id="btn-reveal-all-trivia"
                onClick={handleRevealAll}
                className="bg-red-600 hover:bg-red-700 text-white font-recreio font-extrabold text-xs px-4 py-2.5 rounded-2xl border-2 border-slate-900 shadow-xs transition-transform active:scale-95"
              >
                Revelar Todos os 8 Fatos! ✨
              </button>
            )}
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute top-4 right-4 hidden md:block rotate-12 bg-red-600 text-white font-comic text-sm px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-md">
          100% CANÔNICO!
        </div>
      </div>

      {/* 8 Trivia Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {triviaData.map((item) => {
          const isUnlocked = discoveredIds.includes(item.id);

          return (
            <div
              key={item.id}
              id={`trivia-card-${item.id}`}
              onClick={() => handleDiscover(item.id)}
              className={`cursor-pointer group relative rounded-3xl p-6 border-4 border-slate-900 transition-all duration-200 hover:-translate-y-1 ${
                isUnlocked
                  ? 'bg-white shadow-[6px_6px_0px_#0f172a] hover:shadow-[9px_9px_0px_#dc2626]'
                  : 'bg-amber-50/70 border-dashed shadow-[4px_4px_0px_#94a3b8]'
              }`}
            >
              {/* Header: Pokédex Number & Type Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-amber-300 font-pixel text-[11px] px-2.5 py-1 rounded-lg border border-slate-700">
                    {item.pokedexNumber}
                  </span>
                  <span
                    className={`font-recreio font-extrabold text-xs px-3 py-0.5 rounded-full border border-slate-800 ${item.typeColor}`}
                  >
                    Tipo: {item.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-pixel text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> REGISTRADO
                    </span>
                  ) : (
                    <span className="text-xs font-pixel text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-400 animate-pulse">
                      CLIQUE P/ ABRIR
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="flex items-start gap-3 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:rotate-6 transition-transform">
                  {ICONS_MAP[item.iconName] || <Sparkles className="w-5 h-5 text-amber-600" />}
                </div>

                <div>
                  <h3 className="text-xl font-comic text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-recreio font-bold text-slate-500 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Content / Curiosidade text */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200">
                <div className="inline-block bg-yellow-300 text-slate-900 font-comic text-xs px-2.5 py-0.5 rounded-md mb-2 shadow-2xs">
                  VOCÊ SABIA?
                </div>
                <p className="font-recreio text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>

              {/* Stat Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-pixel text-slate-600">
                <span>{item.stats.label}</span>
                <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
                  +{item.stats.value} {item.stats.value > 900 ? 'LENDÁRIO' : 'MAX'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

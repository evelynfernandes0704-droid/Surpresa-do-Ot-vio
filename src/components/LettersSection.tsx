import React, { useState } from 'react';
import { Mail, Lock, Unlock, Heart, Send, Sparkles, Key, CheckCircle, ShieldAlert, Award, Star, X } from 'lucide-react';
import { Letter } from '../types';
import { lettersData } from '../data/lettersData';
import { playSelect, playSecretUnlock, playBuzzer, playLevelUp } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const UNLOCKED_KEY = 'otavio_birthday_evy_unlocked';

export const LettersSection: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'familia' | 'amigos' | 'especial'>('todas');
  
  // Secret letter password state
  const [isEvyUnlocked, setIsEvyUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNLOCKED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleOpenLetter = (letter: Letter) => {
    playSelect();
    if (letter.isSecret && !isEvyUnlocked) {
      setPasswordError(false);
      setPasswordInput('');
      setShowPasswordModal(true);
      return;
    }
    setSelectedLetter(letter);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim().toLowerCase();
    // Required password: "Vida"
    if (clean === 'vida') {
      playSecretUnlock();
      setIsEvyUnlocked(true);
      setShowPasswordModal(false);
      try {
        localStorage.setItem(UNLOCKED_KEY, 'true');
      } catch {
        // ignore
      }

      // Heart and gold confetti explosion
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
      });

      // Find and open Evy's letter
      const evyLetter = lettersData.find((l) => l.id === 'evy');
      if (evyLetter) {
        setSelectedLetter(evyLetter);
      }
    } else {
      playBuzzer();
      setPasswordError(true);
    }
  };

  const filteredLetters = lettersData.filter((letter) => {
    if (activeFilter === 'todas') return true;
    if (activeFilter === 'especial') return letter.tag === 'especial';
    return letter.tag === activeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Recreio / PokeMail Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-500 to-red-700 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-pixel text-[11px] sm:text-xs px-3 py-1 rounded-full mb-3 border-2 border-slate-900 shadow-xs">
            <Mail className="w-3.5 h-3.5 text-red-600" />
            <span>CORREIO POKÉMON • ED. RECREIO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-comic tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            CARTINHAS E BILHETINHOS DOS AMIGOS & FAMÍLIA!
          </h2>
          <p className="text-sm sm:text-base font-recreio text-red-100 mt-2">
            Cada pessoa que faz parte da jornada do Otávio preparou um bilhete especial. Abra cada carta para ler os recados, zueiras e declarações. Atenção: há uma carta ultrassecreta protegida com senha!
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-recreio font-bold">
            <span className="bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> 12 Mensagens Exclusivas
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-300" /> 1 Carta Secreta Confidencial
            </span>
          </div>
        </div>

        {/* Decorative Mail Icon background */}
        <Mail className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'todas', label: 'Todas as Cartinhas (12)' },
          { id: 'amigos', label: 'Amigos & RPG 🎲' },
          { id: 'familia', label: 'Família & Irmãos 💙' },
          { id: 'especial', label: 'Carta Secreta 🔒' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-letter-${tab.id}`}
            onClick={() => {
              playSelect();
              setActiveFilter(tab.id as any);
            }}
            className={`px-4 py-2 rounded-2xl font-recreio font-bold text-xs sm:text-sm border-2 transition-all whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-red-600 text-white border-slate-900 shadow-[3px_3px_0px_#0f172a]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLetters.map((letter) => {
          const isSecret = letter.isSecret && !isEvyUnlocked;

          return (
            <div
              key={letter.id}
              id={`letter-envelope-${letter.id}`}
              onClick={() => handleOpenLetter(letter)}
              className={`cursor-pointer group relative rounded-3xl p-5 border-3 border-slate-900 transition-all duration-200 hover:-translate-y-1 ${
                isSecret
                  ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 shadow-[6px_6px_0px_#db2777] border-pink-700 hover:shadow-[9px_9px_0px_#be185d]'
                  : letter.id === 'mamae'
                  ? 'bg-gradient-to-br from-amber-50 to-red-50 shadow-[6px_6px_0px_#b91c1c] border-red-700 hover:shadow-[9px_9px_0px_#7f1d1d]'
                  : 'bg-white shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#dc2626]'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-pixel px-2.5 py-1 rounded-full bg-slate-900 text-white border border-slate-700">
                  {letter.badge}
                </span>

                {isSecret ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-pink-700 bg-pink-200/80 px-2.5 py-0.5 rounded-full border border-pink-400 animate-pulse">
                    <Lock className="w-3 h-3" /> Protegido
                  </span>
                ) : letter.isSecret ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400">
                    <Unlock className="w-3 h-3" /> Desbloqueada!
                  </span>
                ) : (
                  <span className="text-xs font-recreio font-extrabold text-slate-500 uppercase">
                    Carta #{letter.id}
                  </span>
                )}
              </div>

              {/* Author & Relation */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${letter.avatarColor} border-2 border-slate-900 flex items-center justify-center text-white shadow-xs text-xl flex-shrink-0 font-comic`}
                >
                  {letter.isSecret && !isEvyUnlocked ? '🔒' : letter.author.slice(0, 1)}
                </div>

                <div>
                  <h3 className="text-lg font-comic text-slate-900 group-hover:text-red-600 transition-colors">
                    {letter.author}
                  </h3>
                  <p className="text-xs font-recreio font-semibold text-slate-600">
                    {letter.relation}
                  </p>
                </div>
              </div>

              {/* Preview Snippet / Secret Blur */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-300">
                {isSecret ? (
                  <div className="bg-purple-100/70 rounded-xl p-3 border border-purple-300 text-center">
                    <Lock className="w-6 h-6 text-purple-700 mx-auto mb-1 animate-bounce" />
                    <p className="font-comic text-purple-900 text-sm">CARTA CONFIDENCIAL SECRETA</p>
                    <p className="text-[11px] font-recreio text-purple-800 font-medium mt-0.5">
                      Conteúdo protegido. Clique para inserir a senha!
                    </p>
                  </div>
                ) : (
                  <p className="font-recreio text-slate-700 text-xs sm:text-sm line-clamp-3 italic">
                    "{letter.favoriteQuote || letter.content.slice(0, 100)}..."
                  </p>
                )}
              </div>

              {/* Open Action Footer */}
              <div className="mt-4 flex items-center justify-between text-xs font-recreio font-extrabold text-red-600 group-hover:text-red-700">
                <span>{isSecret ? 'Destrancar Carta' : 'Abrir Carta'}</span>
                <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Letter Reader Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#fffdf8] max-w-2xl w-full rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[10px_10px_0px_#dc2626] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              id="btn-close-letter"
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full border-2 border-slate-900 flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            {/* Header Stamp */}
            <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedLetter.avatarColor} border-3 border-slate-900 flex items-center justify-center text-white text-2xl font-comic shadow-md`}
              >
                {selectedLetter.id === 'evy' ? '❤️' : selectedLetter.author.slice(0, 1)}
              </div>

              <div>
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-red-600 text-white uppercase">
                  {selectedLetter.badge}
                </span>
                <h3 className="text-2xl font-comic text-slate-900 mt-0.5">
                  De: {selectedLetter.author}
                </h3>
                <p className="text-xs font-recreio font-bold text-slate-500">
                  {selectedLetter.relation}
                </p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="bg-[#fcf8f2] rounded-2xl p-5 border-2 border-amber-200/80 shadow-inner">
              <div className="prose font-recreio text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedLetter.content}
              </div>
            </div>

            {/* Special footer note */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-pixel text-slate-500">
                ★ FEITO COM AMOR PRO OTÁVIO ★
              </span>
              <button
                onClick={() => {
                  playLevelUp();
                  confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.7 },
                  });
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-recreio font-bold text-xs px-4 py-2 rounded-xl border-2 border-slate-900 shadow-xs flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                <span>Salvar no Coração!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Password Modal for Evy's Letter */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 border-4 border-pink-600 shadow-[10px_10px_0px_#db2777] animate-in zoom-in duration-200">
            <button
              id="btn-close-password-modal"
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-full bg-pink-100 border-3 border-pink-600 flex items-center justify-center mx-auto mb-3 text-pink-600 shadow-md">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-center">
              <span className="bg-slate-900 text-amber-300 font-pixel text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border border-slate-700">
                CARTA ULTRASSECRETA • CONFIDENCIAL
              </span>
              <h3 className="text-2xl font-comic text-slate-950 mt-2">
                CARTA DA SUA MALVADA FAVORITA (EVY)
              </h3>
              <p className="text-xs sm:text-sm font-recreio text-slate-600 mt-1">
                Uma mensagem pessoal e confidencial reservada para o aniversariante. Digite a resposta da dica para abrir:
              </p>
            </div>

            {/* Required Password Hint */}
            <div className="mt-4 bg-pink-50 border-2 border-pink-200 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-pixel text-pink-900 uppercase">
                  Dica de Senha:
                </p>
                <p className="font-recreio font-extrabold text-pink-800 text-sm mt-0.5">
                  "O que é mais importante pra mim?"
                </p>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerifyPassword} className="mt-4 space-y-3 font-recreio">
              <div>
                <input
                  type="text"
                  id="input-evy-password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Digite a resposta aqui..."
                  className="w-full text-center px-4 py-3 rounded-2xl border-3 border-slate-900 font-comic text-lg tracking-wider focus:outline-none focus:ring-4 focus:ring-pink-300 uppercase"
                  autoFocus
                />
              </div>

              {passwordError && (
                <div className="text-center bg-red-100 text-red-700 text-xs font-bold py-1.5 px-3 rounded-xl border border-red-300 animate-shake">
                  Senha incorreta! Leia a dica com carinho: "O que é mais importante pra mim?" 😉
                </div>
              )}

              <button
                type="submit"
                id="btn-submit-evy-password"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-recreio font-extrabold text-base py-3 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] transition-all active:translate-y-1 flex items-center justify-center gap-2"
              >
                <Key className="w-5 h-5" />
                <span>Destrancar Cartinha! ❤️</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

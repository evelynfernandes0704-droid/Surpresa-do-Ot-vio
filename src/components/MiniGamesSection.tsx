import React, { useState, useEffect, useRef } from 'react';
import { Swords, Gamepad2, Award, RefreshCw, Heart, Sparkles, Trophy, ArrowRight, Play, Shield, Zap } from 'lucide-react';
import { playSelect, playAttack, playHeal, playLevelUp, playBuzzer } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const MiniGamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'battle' | 'catcher' | 'quiz'>('battle');

  // ==========================================
  // GAME 1: POKEMON FIRE RED BATTLE
  // ==========================================
  const [playerHp, setPlayerHp] = useState(220);
  const [maxPlayerHp] = useState(220);
  const [enemyHp, setEnemyHp] = useState(220);
  const [maxEnemyHp] = useState(220);
  const [battleLog, setBattleLog] = useState<string>('Um BOLETO SELVAGEM & CRISE DOS 22 apareceu! O que Otávio fará?');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleState, setBattleState] = useState<'intro' | 'action' | 'won' | 'lost'>('action');
  const [playerExp, setPlayerExp] = useState(0);

  const resetBattle = () => {
    playSelect();
    setPlayerHp(220);
    setEnemyHp(220);
    setBattleLog('Um BOLETO SELVAGEM & CRISE DOS 22 apareceu! O que Otávio fará?');
    setIsPlayerTurn(true);
    setBattleState('action');
  };

  const handlePlayerMove = (moveName: string) => {
    if (!isPlayerTurn || battleState !== 'action') return;
    playSelect();
    setIsPlayerTurn(false);

    let damage = 0;
    let logMsg = '';

    if (moveName === 'doce_raro') {
      playHeal();
      const healAmount = 60;
      setPlayerHp((prev) => Math.min(maxPlayerHp, prev + healAmount));
      setPlayerExp((prev) => prev + 150);
      logMsg = '🍬 Otávio usou DOCE RARO! O sabor restaurou 60 de HP e concedeu +150 XP de pura nostalgia!';
    } else if (moveName === 'risada') {
      playAttack();
      damage = 60;
      logMsg = '😂 Otávio soltou uma RISADA CONTAGIANTE com LÁBIA LENDÁRIA! O Boleto ficou com status "Persuadido" e perdeu 60 HP!';
    } else if (moveName === 'ditto') {
      playAttack();
      damage = 70;
      logMsg = '🎙️ Otávio ativou a DUBLAGEM DO DITTO! Imitou o narrador com perfeição épica causando 70 de dano!';
    } else if (moveName === 'esquivo') {
      playAttack();
      damage = 95;
      logMsg = '⚔️ "ESQUIVO E TE MATO!" Golpe supremo de RPG do Keven! Dano Crítico de 95 HP!';
    } else if (moveName === 'livro') {
      playAttack();
      damage = 110;
      logMsg = '📖 Otávio ameaçou PUBLICAR O RASCUNHO DO LIVRO #999! O adversário entrou em colapso de curiosidade e perdeu 110 HP!';
    }

    if (damage > 0) {
      setEnemyHp((prev) => {
        const next = Math.max(0, prev - damage);
        if (next === 0) {
          setTimeout(() => {
            playLevelUp();
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
            });
            setBattleState('won');
            setBattleLog('🎉 VITÓRIA! O Boleto foi derrotado pelo poder da amizade e dos 22 anos! Otávio subiu para o Nível 22 Mestre!');
          }, 800);
        }
        return next;
      });
    }

    setBattleLog(logMsg);

    // Enemy Retaliation after 1.4s if not dead
    setTimeout(() => {
      setEnemyHp((currentEnemyHp) => {
        if (currentEnemyHp > 0) {
          const enemyAttacks = [
            { text: '💥 Boleto cobrou a fatura atrasada com juros! Causou 35 de dano!', dmg: 35 },
            { text: '💤 Dor na lombar dos 22 anos se manifestou! Otávio perdeu 30 de HP!', dmg: 30 },
            { text: '⏰ Despertador tocou cedo no sábado sem RPG! Otávio tomou 40 de dano!', dmg: 40 },
          ];
          const chosen = enemyAttacks[Math.floor(Math.random() * enemyAttacks.length)];
          playAttack();
          setPlayerHp((prev) => {
            const nextHp = Math.max(0, prev - chosen.dmg);
            if (nextHp === 0) {
              setBattleState('lost');
              setBattleLog('Oh não! O cansaço acumulou. Coma um Doce Raro para reiniciar a batalha!');
            }
            return nextHp;
          });
          setBattleLog(chosen.text);
          setIsPlayerTurn(true);
        }
        return currentEnemyHp;
      });
    }, 1400);
  };

  // ==========================================
  // GAME 2: BULBASAUR CANDY CATCHER ARCADE
  // ==========================================
  const [catcherScore, setCatcherScore] = useState(0);
  const [catcherLives, setCatcherLives] = useState(3);
  const [catcherActive, setCatcherActive] = useState(false);
  const [bulbaPos, setBulbaPos] = useState(50); // percentage 0 - 100
  const [items, setItems] = useState<{ id: number; x: number; y: number; type: 'candy' | 'book' | 'burger' | 'alarm' }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startCatcherGame = () => {
    playSelect();
    setCatcherScore(0);
    setCatcherLives(3);
    setItems([]);
    setBulbaPos(50);
    setCatcherActive(true);
  };

  // Game loop for arcade catcher
  useEffect(() => {
    if (!catcherActive) return;

    const spawnInterval = setInterval(() => {
      const types: ('candy' | 'book' | 'burger' | 'alarm')[] = ['candy', 'candy', 'book', 'burger', 'alarm'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setItems((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          type: randomType,
        },
      ]);
    }, 900);

    const moveInterval = setInterval(() => {
      setItems((prev) => {
        const nextItems: typeof prev = [];
        prev.forEach((item) => {
          const nextY = item.y + 4;
          // check collision with Bulbasaur at bottom (y > 80)
          if (nextY >= 80 && nextY <= 92 && Math.abs(item.x - bulbaPos) < 15) {
            // Collision caught!
            if (item.type === 'alarm') {
              playBuzzer();
              setCatcherLives((l) => {
                const updated = l - 1;
                if (updated <= 0) {
                  setCatcherActive(false);
                }
                return updated;
              });
            } else {
              playSelect();
              const pts = item.type === 'book' ? 150 : item.type === 'candy' ? 100 : 80;
              setCatcherScore((s) => s + pts);
            }
          } else if (nextY < 95) {
            nextItems.push({ ...item, y: nextY });
          }
        });
        return nextItems;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [catcherActive, bulbaPos]);

  // Keyboard navigation for Catcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!catcherActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBulbaPos((p) => Math.max(10, p - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBulbaPos((p) => Math.min(90, p + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catcherActive]);

  // ==========================================
  // GAME 3: QUIZ REVISTA RECREIO OTAVIOVERSO
  // ==========================================
  const quizQuestions = [
    {
      question: 'Qual é o Pokémon favorito do aniversariante Otávio?',
      options: ['Charmander', 'Bulbassauro #001', 'Squirtle', 'Pikachu'],
      correct: 1,
      explanation: 'Enquanto a maioria se divide entre fogo e água, o coração do Otávio bate forte pelo Bulbassauro!',
    },
    {
      question: 'O que o Keven sempre pergunta na cartinha acróstica de aniversário?',
      options: ['Bora comer pizza?', 'Sábado tem RPG?', 'Cadê o doce raro?', 'Me empresta 10 conto?'],
      correct: 1,
      explanation: 'A letra S do PARABENS é clássica: "S = Sábado tem rpg?"!',
    },
    {
      question: 'Onde estão guardadas as maiores obras literárias e livros do Otávio?',
      options: ['Nas livrarias de Kanto', 'No topo da Amazon', 'Guardadas a sete chaves nos rascunhos!', 'No Instagram'],
      correct: 2,
      explanation: 'Postar ou terminar um livro? Jamais! Ele prefere o mistério do "próximo episódio"!',
    },
    {
      question: 'Segundo o amigo GL, como o Otávio continua evoluindo de ano em ano?',
      options: ['Fazendo academia pesada', 'Comeno Doce Raro (Rare Candy)!', 'Tomando energético', 'Dormindo 12h'],
      correct: 1,
      explanation: '"Mais um ano de vida e você continua comeno doce raro pra evoluir. Parabéns.... é issu!"',
    },
    {
      question: 'Qual é a frase clássica que o Matheus reforçou na cartinha de aniversário?',
      options: ['Sempre diga SHOW!!', 'Bora pro RPG no sábado!', 'Partiu McDonald\'s comemorar', 'Cadê o meu Bulbassauro?'],
      correct: 0,
      explanation: 'Como o amigo Matheus escreveu: "Thank you por tudo e lembre-se, Sempre diga SHOW!!" 😎',
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === quizQuestions[currentQuestion].correct) {
      playLevelUp();
      setQuizScore((prev) => prev + 1);
    } else {
      playBuzzer();
    }
  };

  const handleNextQuestion = () => {
    playSelect();
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const resetQuiz = () => {
    playSelect();
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8">
      {/* Recreio Arcade Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-slate-950 font-pixel text-[11px] sm:text-xs px-3 py-1 rounded-full mb-3 border-2 border-slate-900 shadow-xs">
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>SALA DE JOGOS & DESAFIOS • REVISTA RECREIO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-comic tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            MINIGAMES ENGRAÇADOS DO OTÁVIO!
          </h2>
          <p className="text-sm sm:text-base font-recreio text-green-100 mt-2">
            Desafie os chefões da vida adulta na lendária Batalha Pokémon Fire Red, pegue doces raros com o Bulbassauro ou teste seus conhecimentos no Quiz do Otávioverso!
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          <button
            id="tab-game-battle"
            onClick={() => {
              playSelect();
              setActiveGame('battle');
            }}
            className={`px-4 py-2 rounded-2xl font-recreio font-extrabold text-xs sm:text-sm border-2 transition-all flex items-center gap-2 ${
              activeGame === 'battle'
                ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-emerald-800/80 text-white border-emerald-950 hover:bg-emerald-700'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>1. Batalha Fire Red: Otávio vs Boletos</span>
          </button>

          <button
            id="tab-game-catcher"
            onClick={() => {
              playSelect();
              setActiveGame('catcher');
            }}
            className={`px-4 py-2 rounded-2xl font-recreio font-extrabold text-xs sm:text-sm border-2 transition-all flex items-center gap-2 ${
              activeGame === 'catcher'
                ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-emerald-800/80 text-white border-emerald-950 hover:bg-emerald-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>2. Corrida do Bulbassauro</span>
          </button>

          <button
            id="tab-game-quiz"
            onClick={() => {
              playSelect();
              setActiveGame('quiz');
            }}
            className={`px-4 py-2 rounded-2xl font-recreio font-extrabold text-xs sm:text-sm border-2 transition-all flex items-center gap-2 ${
              activeGame === 'quiz'
                ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-emerald-800/80 text-white border-emerald-950 hover:bg-emerald-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Quiz Recreio do Otávio</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. GAME: POKEMON FIRE RED BATTLE ARENA    */}
      {/* ========================================== */}
      {activeGame === 'battle' && (
        <div className="bg-[#1e293b] p-4 sm:p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
          {/* Game Boy Advance Screen Frame */}
          <div className="relative bg-[#f8fafc] rounded-2xl border-4 border-slate-900 overflow-hidden shadow-inner scanlines">
            {/* Top Bar: Battle Stage */}
            <div className="p-4 sm:p-6 min-h-[300px] flex flex-col justify-between relative bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]">
              {/* ENEMY STATUS HUD (Top Right) */}
              <div className="self-end w-full max-w-[280px] sm:max-w-[320px] bg-[#fffdf0] p-3 rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
                <div className="flex items-center justify-between font-pixel text-[11px] text-slate-900">
                  <span className="font-bold">BOLETO & CRISE</span>
                  <span className="text-red-600">Lv. 22</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-pixel bg-amber-400 text-slate-950 px-1 rounded font-bold">
                    HP
                  </span>
                  <div className="flex-1 h-3 bg-slate-300 rounded-full overflow-hidden border border-slate-700 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        enemyHp > 110 ? 'bg-emerald-500' : enemyHp > 40 ? 'bg-amber-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right text-[10px] font-pixel text-slate-700 mt-1">
                  {enemyHp}/{maxEnemyHp}
                </div>
              </div>

              {/* ENEMY SPRITE (Top Left/Center) */}
              <div className="absolute top-20 left-8 sm:left-16 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-rose-100 rounded-2xl border-3 border-slate-900 shadow-md flex items-center justify-center text-4xl sm:text-5xl animate-bounce">
                  📄💔
                </div>
                <div className="w-20 h-4 bg-slate-400/40 rounded-full blur-xs mt-1"></div>
              </div>

              {/* PLAYER SPRITE (Bottom Left) */}
              <div className="self-start mt-12 flex flex-col items-center z-10">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-emerald-100 rounded-2xl border-3 border-slate-900 shadow-md flex items-center justify-center text-5xl relative">
                  🌿🧢
                  <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white font-pixel text-[9px] px-2 py-0.5 rounded-full border border-slate-900">
                    BULBA #001
                  </span>
                </div>
                <div className="w-28 h-4 bg-slate-400/50 rounded-full blur-xs mt-1"></div>
              </div>

              {/* PLAYER STATUS HUD (Bottom Right) */}
              <div className="self-end -mt-16 w-full max-w-[280px] sm:max-w-[320px] bg-[#fffdf0] p-3 rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] z-10">
                <div className="flex items-center justify-between font-pixel text-[11px] text-slate-900">
                  <span className="font-bold">OTÁVIO</span>
                  <span className="text-emerald-700">Lv. 22</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-pixel bg-amber-400 text-slate-950 px-1 rounded font-bold">
                    HP
                  </span>
                  <div className="flex-1 h-3 bg-slate-300 rounded-full overflow-hidden border border-slate-700 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        playerHp > 110 ? 'bg-emerald-500' : playerHp > 40 ? 'bg-amber-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-pixel text-slate-700 mt-1">
                  <span>EXP: {playerExp}</span>
                  <span>
                    {playerHp}/{maxPlayerHp}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Classic Pokémon Dialogue & Fight Command Box */}
            <div className="bg-[#1e293b] p-3 border-t-4 border-slate-900 text-white font-pixel text-xs">
              {/* Dialogue Bar */}
              <div className="bg-[#fffdf8] text-slate-900 p-4 rounded-xl border-3 border-slate-900 min-h-[75px] flex items-center shadow-inner text-xs sm:text-sm font-recreio font-bold leading-relaxed">
                {battleLog}
              </div>

              {/* Action Buttons */}
              {battleState === 'action' ? (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    id="btn-move-doce"
                    onClick={() => handlePlayerMove('doce_raro')}
                    disabled={!isPlayerTurn}
                    className="p-3 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white rounded-xl border-2 border-slate-900 font-recreio font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                  >
                    <span>🍬</span>
                    <span>Doce Raro (+60 HP)</span>
                  </button>

                  <button
                    id="btn-move-risada"
                    onClick={() => handlePlayerMove('risada')}
                    disabled={!isPlayerTurn}
                    className="p-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl border-2 border-slate-900 font-recreio font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                  >
                    <span>😂</span>
                    <span>Risada & Lábia</span>
                  </button>

                  <button
                    id="btn-move-ditto"
                    onClick={() => handlePlayerMove('ditto')}
                    disabled={!isPlayerTurn}
                    className="p-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded-xl border-2 border-slate-900 font-recreio font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                  >
                    <span>🎙️</span>
                    <span>Voz do Ditto</span>
                  </button>

                  <button
                    id="btn-move-esquivo"
                    onClick={() => handlePlayerMove('esquivo')}
                    disabled={!isPlayerTurn}
                    className="p-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl border-2 border-slate-900 font-recreio font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                  >
                    <span>⚔️</span>
                    <span>Esquivo e Te Mato!</span>
                  </button>

                  <button
                    id="btn-move-livro"
                    onClick={() => handlePlayerMove('livro')}
                    disabled={!isPlayerTurn}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl border-2 border-slate-900 font-recreio font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                  >
                    <span>📖</span>
                    <span>Ameaçar Livro</span>
                  </button>

                  <button
                    id="btn-reset-battle"
                    onClick={resetBattle}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl border-2 border-slate-900 font-recreio font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reiniciar Luta</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-center">
                  <button
                    id="btn-restart-after-finish"
                    onClick={resetBattle}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-comic text-lg rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center gap-2 animate-bounce"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Jogar Outra Batalha Pokémon!</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. GAME: BULBASAUR CANDY CATCHER ARCADE    */}
      {/* ========================================== */}
      {activeGame === 'catcher' && (
        <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="bg-emerald-600 text-white font-pixel text-[10px] px-2.5 py-1 rounded">
                MINIGAME DE COLETAR
              </span>
              <h3 className="text-2xl font-comic text-slate-900 mt-1">
                CORRIDA DOS DOCES RAROS DO BULBASSAURO!
              </h3>
              <p className="text-xs font-recreio text-slate-600">
                Mova o Bulbassauro usando as teclas ← e → (ou os botões na tela) para pegar doces (🍬), livros (📚) e lanches (🍔). Evite os despertadores (⏰)!
              </p>
            </div>

            <div className="flex items-center gap-4 bg-amber-100 px-4 py-2 rounded-2xl border-2 border-slate-900">
              <div className="text-center">
                <div className="text-[10px] font-pixel text-slate-700">PONTOS</div>
                <div className="text-xl font-comic text-red-600">{catcherScore}</div>
              </div>
              <div className="h-8 w-0.5 bg-slate-300"></div>
              <div className="text-center">
                <div className="text-[10px] font-pixel text-slate-700">VIDAS</div>
                <div className="flex gap-1 text-red-600 text-sm">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i}>{i < catcherLives ? '❤️' : '🖤'}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arcade Canvas Area */}
          <div
            ref={gameAreaRef}
            className="relative w-full h-[360px] bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-inner"
          >
            {!catcherActive ? (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                <span className="text-5xl mb-2">🌿🍬</span>
                <h4 className="text-3xl font-comic text-white">
                  {catcherLives <= 0 ? 'FIM DE JOGO!' : 'PRONTO PARA JOGAR?'}
                </h4>
                <p className="text-sm font-recreio text-amber-200 mt-1 max-w-sm">
                  {catcherLives <= 0
                    ? `Parabéns! Você alcançou ${catcherScore} pontos colecionando mimos pro Otávio!`
                    : 'Colete o máximo de itens nostálgicos que conseguir antes que as 3 vidas acabem!'}
                </p>
                <button
                  id="btn-start-catcher"
                  onClick={startCatcherGame}
                  className="mt-5 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-comic text-lg rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center gap-2 animate-pulse"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>{catcherLives <= 0 ? 'Jogar Novamente' : 'Começar Desafio!'}</span>
                </button>
              </div>
            ) : null}

            {/* Falling items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute text-3xl select-none transition-transform pointer-events-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.type === 'candy'
                  ? '🍬'
                  : item.type === 'book'
                  ? '📚'
                  : item.type === 'burger'
                  ? '🍔'
                  : '⏰'}
              </div>
            ))}

            {/* Bulbasaur Player at bottom */}
            <div
              className="absolute bottom-2 transition-all duration-75 text-4xl select-none flex flex-col items-center"
              style={{
                left: `${bulbaPos}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <span>🌿🐸</span>
              <div className="w-12 h-2 bg-slate-800/30 rounded-full blur-xs"></div>
            </div>
          </div>

          {/* On-screen controls for mobile touch */}
          <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
            <button
              onClick={() => setBulbaPos((p) => Math.max(10, p - 12))}
              className="w-16 h-14 bg-slate-900 text-white rounded-2xl font-comic text-2xl border-2 border-slate-700 shadow-md active:bg-slate-800"
            >
              ←
            </button>
            <span className="text-xs font-pixel text-slate-600">CONTROLES TOUCH</span>
            <button
              onClick={() => setBulbaPos((p) => Math.min(90, p + 12))}
              className="w-16 h-14 bg-slate-900 text-white rounded-2xl font-comic text-2xl border-2 border-slate-700 shadow-md active:bg-slate-800"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. GAME: QUIZ REVISTA RECREIO              */}
      {/* ========================================== */}
      {activeGame === 'quiz' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] max-w-2xl mx-auto">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4">
                <span className="bg-red-600 text-white font-pixel text-[10px] px-2.5 py-1 rounded">
                  TESTE DE NERDICE RECREIO
                </span>
                <span className="text-xs font-pixel text-slate-600">
                  PERGUNTA {currentQuestion + 1} DE {quizQuestions.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-comic text-slate-900 leading-snug">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="mt-5 space-y-2.5">
                {quizQuestions[currentQuestion].options.map((opt, idx) => {
                  let btnColor = 'bg-slate-50 border-slate-300 hover:border-slate-800 text-slate-800';
                  if (selectedOption !== null) {
                    if (idx === quizQuestions[currentQuestion].correct) {
                      btnColor = 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold';
                    } else if (idx === selectedOption) {
                      btnColor = 'bg-rose-100 border-rose-600 text-rose-900';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-opt-${idx}`}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-recreio font-bold text-sm sm:text-base transition-all flex items-center justify-between ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && idx === quizQuestions[currentQuestion].correct && (
                        <span className="text-emerald-600 font-pixel text-xs">CERTO! ✨</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-4 bg-amber-50 p-3.5 rounded-xl border-2 border-amber-300 animate-in fade-in">
                  <p className="text-xs sm:text-sm font-recreio font-semibold text-slate-800">
                    💡 <span className="font-bold text-amber-900">VOCÊ SABIA?</span> {quizQuestions[currentQuestion].explanation}
                  </p>
                  <button
                    id="btn-next-quiz"
                    onClick={handleNextQuestion}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-recreio font-extrabold py-2.5 rounded-xl border-2 border-slate-900 shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentQuestion + 1 === quizQuestions.length ? 'Ver Resultado Final' : 'Próxima Pergunta'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-yellow-100 border-3 border-slate-900 flex items-center justify-center mx-auto mb-3 text-4xl shadow-md">
                🏆
              </div>
              <span className="bg-emerald-600 text-white font-comic text-xs px-3 py-1 rounded-full uppercase">
                CERTIFICADO RECREIO DESBLOQUEADO
              </span>
              <h3 className="text-3xl font-comic text-slate-900 mt-2">
                PONTUAÇÃO: {quizScore} DE {quizQuestions.length} ACERTOS!
              </h3>
              <p className="text-sm font-recreio text-slate-600 mt-2 max-w-md mx-auto">
                {quizScore === 5
                  ? 'GÊNIO SUPREMO! Você é um verdadeiro mestre no lore do Otávio, conhece cada detalhe do Bulbassauro e dos livros!'
                  : 'Mandou super bem! Com certeza você é um parceiro de RPG digno de sentar na escadaria do metrô!'}
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  id="btn-restart-quiz"
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-recreio font-extrabold rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Fazer o Quiz de Novo!</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

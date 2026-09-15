import React, { useState } from 'react';
import { Camera, ZoomIn, ZoomOut, Maximize2, Minimize2, Heart, Info } from 'lucide-react';
import { playSelect, playLevelUp } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { MURAL_BASE64 } from '../data/muralDataUri';

export const MemoryWall: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(MURAL_BASE64 || '/mural_otavio.jpg');

  const handleImageError = () => {
    if (imageSrc !== '/mural_otavio.jpg') {
      setImageSrc('/mural_otavio.jpg');
    }
  };

  const handleZoomIn = () => {
    playSelect();
    setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  };

  const handleZoomOut = () => {
    playSelect();
    setZoomLevel((prev) => Math.max(1, prev - 0.25));
  };

  const handleResetZoom = () => {
    playSelect();
    setZoomLevel(1);
  };

  // Highlights of the 36 moments embedded in the single collage
  const collageHighlights = [
    {
      id: 'mamae',
      title: 'Com a Mamãe ❣️',
      desc: 'Amor incondicional, carinho e o primeiro título de mãe do Otávio.',
      badge: 'Porto Seguro',
      color: 'bg-rose-500 text-white',
    },
    {
      id: 'evy',
      title: 'Com a Evy (Sua Malvada Favorita) 🔒',
      desc: 'Amigos parceiros, cosplay marcante, risadas e uma cartinha secreta!',
      badge: 'Carta Secreta',
      color: 'bg-purple-600 text-white',
    },
    {
      id: 'irmaos',
      title: 'Oliver & Memel 😼',
      desc: 'Irmão e irmã com anos de convivência, nerdice e zueira compartilhada.',
      badge: 'Irmandade',
      color: 'bg-blue-600 text-white',
    },
    {
      id: 'rpg',
      title: 'Turma do RPG & Metrô 🎲',
      desc: 'Encontros na escadaria do metrô com Keven, Vini, Kayk e toda a galera.',
      badge: 'Sábado tem RPG?',
      color: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'mcdia',
      title: 'Niver no McDonald\'s 🍔',
      desc: 'Cartaz clássico do "Aniversariante do Mês - 18/09 Otávio" celebrando.',
      badge: '18/09 Oficial',
      color: 'bg-red-600 text-white',
    },
    {
      id: 'infancia',
      title: 'Mini Otávio (Lv. 1) 👶',
      desc: 'Bebê no macacão azul e primeiros passos comendo doce raro desde cedo!',
      badge: 'Início da Jornada',
      color: 'bg-emerald-600 text-white',
    },
    {
      id: 'roblox',
      title: 'Aventuras no Roblox 🕹️',
      desc: 'Skins lendárias, batalhas de espada, Guaxilynn, ovMNine e zueiras virtuais.',
      badge: 'Gamer Geek',
      color: 'bg-indigo-600 text-white',
    },
    {
      id: 'sonic',
      title: 'Sonic Vibe & Filtros 🦔',
      desc: 'Filtro clássico de Sonic e momentos cômicos com os amigos.',
      badge: 'Zueira Máxima',
      color: 'bg-sky-500 text-white',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Recreio / Fire Red Poster Hero Header */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 font-pixel text-[11px] sm:text-xs px-3 py-1 rounded-full mb-3 border border-amber-400">
            <Camera className="w-3.5 h-3.5" />
            <span>MURAL DE MEMÓRIAS • EDIÇÃO COLECIONADOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-comic text-slate-950 tracking-wide leading-tight">
            O GRANDE PÔSTER DE 22 ANOS DO OTÁVIO!
          </h2>
          <p className="text-sm sm:text-base font-recreio font-semibold text-slate-900 mt-2">
            Todas as memórias reunidas em um único mural especial: fotos com a família, a Evy, os irmãos, a turma do RPG, a infância e os melhores momentos dessa jornada!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-recreio font-extrabold text-slate-950 bg-white/90 px-4 py-2 rounded-xl border-2 border-slate-900 shadow-xs">
              📸 Pôster Oficial Completo • 36 Fotos Reunidas
            </span>
            <span className="text-xs font-recreio font-bold text-slate-900 bg-amber-200/80 px-3.5 py-2 rounded-xl border border-slate-800/30">
              🔍 Use os controles de Zoom ou Tela Cheia para inspecionar cada foto
            </span>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute top-4 right-4 hidden md:block rotate-12 bg-yellow-300 text-slate-950 font-comic text-sm px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-md">
          ★ SUPER PÔSTER RECREIO ★
        </div>
      </div>

      {/* Main Poster Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border-4 border-slate-900 shadow-[10px_10px_0px_#0f172a] space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-pixel text-[10px] sm:text-xs px-2.5 py-1 rounded">
              VISUALIZADOR GBA
            </span>
            <span className="text-xs font-recreio font-bold text-slate-600">
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-zoom-in"
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 text-slate-800 transition-transform active:scale-95"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              id="btn-zoom-out"
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 text-slate-800 transition-transform active:scale-95"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-zoom"
              onClick={handleResetZoom}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 text-slate-800 text-xs font-recreio font-bold transition-transform active:scale-95"
            >
              100%
            </button>

            <button
              id="btn-fullscreen-toggle"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 border-2 border-slate-800 text-slate-950 transition-transform active:scale-95"
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                playLevelUp();
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-recreio font-bold border-2 border-slate-900 shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Adorar Pôster!</span>
            </button>
          </div>
        </div>

        {/* Display Frame for the Single Mural Photo */}
        <div
          className={`relative rounded-2xl border-4 border-slate-900 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center ${
            isFullscreen ? 'fixed inset-4 z-50 bg-white/95 max-h-none h-[95vh]' : 'min-h-[420px] max-h-[750px]'
          }`}
        >
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-30 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full border-2 border-white shadow-md"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}

          <div className="w-full h-full overflow-auto flex items-center justify-center p-2 sm:p-4 no-scrollbar">
            <img
              src={imageSrc}
              onError={handleImageError}
              alt="Pôster Mural Completo - 22 Anos do Otávio"
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              className="max-w-full max-h-full object-contain rounded-xl shadow-md transition-transform duration-200 cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>

        {/* Legend / Guide to the 36 moments in the photo */}
        <div className="bg-amber-50/80 rounded-2xl p-5 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-red-600" />
            <h4 className="text-lg font-comic text-slate-900 tracking-wide">
              GUIA DO PÔSTER: O QUE CADA FOTO REPRESENTA NO CORAÇÃO DO OTÁVIO
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {collageHighlights.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border-2 border-slate-900/15 shadow-2xs hover:border-slate-900 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-comic text-base text-slate-900">{item.title}</span>
                  <span className={`text-[9px] font-pixel px-2 py-0.5 rounded ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs font-recreio text-slate-600 leading-snug font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

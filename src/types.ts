export interface Letter {
  id: string;
  author: string;
  relation: string;
  badge: string;
  avatarColor: string;
  content: string;
  isSecret?: boolean;
  password?: string;
  hint?: string;
  favoriteQuote?: string;
  tag: 'familia' | 'amigos' | 'especial';
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'familia' | 'amigos' | 'cosplay' | 'nerd' | 'infancia';
  date?: string;
  isUserUploaded?: boolean;
}

export interface TriviaItem {
  id: number;
  pokedexNumber: string;
  title: string;
  subtitle: string;
  content: string;
  type: 'Planta' | 'Fogo' | 'Psíquico' | 'Normal' | 'Lendário' | 'Elétrico' | 'Voador' | 'Dragão';
  typeColor: string;
  iconName: string;
  stats: {
    label: string;
    value: number;
  };
}

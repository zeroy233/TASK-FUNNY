export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: 'STRENGTH' | 'INTELLIGENCE' | 'AGILITY' | 'CHARISMA';
  completed: boolean;
  isDaily?: boolean;
  xpReward: number;
  goldReward: number;
  createdAt: number;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  gold: number;
  hp: number;
  maxHp: number;
  avatar: string;
  skills: {
    STRENGTH: number;
    INTELLIGENCE: number;
    AGILITY: number;
    CHARISMA: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'EQUIPMENT' | 'CONSUMABLE' | 'BADGE';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  icon: string;
}

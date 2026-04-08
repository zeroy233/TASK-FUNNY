import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quest, UserStats, Difficulty } from './types';
import { QUEST_LIBRARY } from './constants/questLibrary';

interface GameContextType {
  stats: UserStats;
  quests: Quest[];
  addQuest: (title: string, description: string, difficulty: Difficulty, category: Quest['category'], isDaily?: boolean) => void;
  completeQuest: (id: string) => void;
  undoQuest: (id: string) => void;
  deleteQuest: (id: string) => void;
  gainXp: (amount: number) => void;
  gainGold: (amount: number) => void;
  updateAvatar: (avatarUrl: string) => void;
  refreshDailyQuests: () => void;
  showLevelUp: boolean;
}

const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  gold: 0,
  hp: 100,
  maxHp: 100,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  skills: {
    STRENGTH: 0,
    INTELLIGENCE: 0,
    AGILITY: 0,
    CHARISMA: 0,
  },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('questlog_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('questlog_quests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('questlog_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('questlog_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    const checkRefresh = () => {
      const lastRefresh = localStorage.getItem('questlog_last_refresh');
      const today = new Date().toDateString();
      
      if (lastRefresh !== today) {
        refreshDailyQuests();
        localStorage.setItem('questlog_last_refresh', today);
      }
    };

    // Initial check
    checkRefresh();

    // Check every minute in case the app stays open past midnight
    const interval = setInterval(checkRefresh, 60000);
    return () => clearInterval(interval);
  }, []);

  const refreshDailyQuests = () => {
    setQuests(prev => {
      // 1. Reset existing daily quests
      const resetQuests = prev.map(q => q.isDaily ? { ...q, completed: false } : q);
      
      // 2. Check how many daily quests we have
      const dailyCount = resetQuests.filter(q => q.isDaily).length;
      
      // 3. If less than 3, add new ones from library
      if (dailyCount < 3) {
        const xpRewards = { EASY: 10, MEDIUM: 25, HARD: 60, EPIC: 150 };
        const goldRewards = { EASY: 5, MEDIUM: 15, HARD: 40, EPIC: 100 };
        
        const availableTemplates = QUEST_LIBRARY.filter(t => 
          !resetQuests.some(q => q.title === t.title)
        );
        
        const shuffled = [...availableTemplates].sort(() => 0.5 - Math.random());
        const toAdd = shuffled.slice(0, 3 - dailyCount);
        
        const newQuests: Quest[] = toAdd.map(t => ({
          id: crypto.randomUUID(),
          title: t.title,
          description: t.description,
          difficulty: t.difficulty,
          category: t.category,
          completed: false,
          isDaily: true,
          xpReward: xpRewards[t.difficulty],
          goldReward: goldRewards[t.difficulty],
          createdAt: Date.now(),
        }));
        
        return [...newQuests, ...resetQuests];
      }
      
      return resetQuests;
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    setStats(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const addQuest = (title: string, description: string, difficulty: Difficulty, category: Quest['category'], isDaily: boolean = false) => {
    const xpRewards = { EASY: 10, MEDIUM: 25, HARD: 60, EPIC: 150 };
    const goldRewards = { EASY: 5, MEDIUM: 15, HARD: 40, EPIC: 100 };

    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      description,
      difficulty,
      category,
      completed: false,
      isDaily,
      xpReward: xpRewards[difficulty],
      goldReward: goldRewards[difficulty],
      createdAt: Date.now(),
    };
    setQuests((prev) => [newQuest, ...prev]);
  };

  const completeQuest = (id: string) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;

    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: true } : q)));
    gainXp(quest.xpReward);
    gainGold(quest.goldReward);
    
    // Skill progression
    setStats(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [quest.category]: prev.skills[quest.category] + 1
      }
    }));
  };

  const undoQuest = (id: string) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest || !quest.completed) return;

    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: false } : q)));
    
    // Reverse rewards (simplified, doesn't handle level down for now to keep it simple)
    setStats(prev => ({
      ...prev,
      xp: Math.max(0, prev.xp - quest.xpReward),
      gold: Math.max(0, prev.gold - quest.goldReward),
      skills: {
        ...prev.skills,
        [quest.category]: Math.max(0, prev.skills[quest.category] - 1)
      }
    }));
  };

  const deleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const [showLevelUp, setShowLevelUp] = useState(false);

  const gainXp = (amount: number) => {
    setStats((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;
      let leveledUp = false;

      while (newXp >= newNextLevelXp) {
        newXp -= newNextLevelXp;
        newLevel += 1;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.5);
        leveledUp = true;
      }

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 5000);
      }

      return { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
    });
  };

  const gainGold = (amount: number) => {
    setStats((prev) => ({ ...prev, gold: prev.gold + amount }));
  };

  return (
    <GameContext.Provider value={{ stats, quests, addQuest, completeQuest, undoQuest, deleteQuest, gainXp, gainGold, updateAvatar, refreshDailyQuests, showLevelUp }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ScrollText, 
  Sword, 
  Backpack, 
  Store, 
  User as UserIcon, 
  Settings as SettingsIcon,
  Plus,
  Trophy,
  Zap,
  Coins,
  Heart,
  ChevronRight,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { GameProvider, useGame } from './GameContext';
import Scene from './components/Scene';
import { cn } from './lib/utils';
import { Difficulty, Quest } from './types';

// --- Components ---

const Navbar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '仪表盘' },
    { id: 'quests', icon: ScrollText, label: '任务' },
    { id: 'skills', icon: Sword, label: '技能' },
    { id: 'inventory', icon: Backpack, label: '背包' },
    { id: 'shop', icon: Store, label: '商店' },
    { id: 'profile', icon: UserIcon, label: '个人' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gaming-card/80 backdrop-blur-xl border border-gaming-border rounded-2xl p-2 flex items-center gap-1 shadow-2xl">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          className={cn(
            "relative p-3 rounded-xl transition-all duration-300 group",
            activePage === item.id ? "text-gaming-accent bg-gaming-accent/10" : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <item.icon size={24} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gaming-card border border-gaming-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {item.label}
          </span>
          {activePage === item.id && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 border-2 border-gaming-accent rounded-xl"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
};

const Header = () => {
  const { stats } = useGame();
  
  return (
    <header className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gaming-accent">
          <img src={stats.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">等级 {stats.level} 探险者</div>
          <div className="w-48 h-2 bg-gaming-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gaming-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={20} />
          <span className="font-mono font-bold">{stats.hp}/{stats.maxHp}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="text-yellow-500" size={20} />
          <span className="font-mono font-bold">{stats.gold}</span>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const Dashboard = () => {
  const { stats, quests, completeQuest, refreshDailyQuests } = useGame();
  const activeQuests = quests.filter(q => !q.completed);
  const dailyQuests = quests.filter(q => q.isDaily);
  
  return (
    <div className="max-w-6xl mx-auto pt-32 pb-32 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 space-y-6"
      >
        <div className="gaming-card overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={120} />
          </div>
          <h2 className="text-3xl font-bold mb-2">欢迎回来，英雄。</h2>
          <p className="text-gray-400 mb-6">你今天有 {activeQuests.length} 个活跃任务。准备好升级了吗？</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.skills).map(([skill, value]) => {
              const skillNames: Record<string, string> = {
                STRENGTH: '力量',
                INTELLIGENCE: '智力',
                AGILITY: '敏捷',
                CHARISMA: '魅力'
              };
              return (
                <div key={skill} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase tracking-tighter text-gray-500 mb-1">{skillNames[skill] || skill}</div>
                  <div className="text-xl font-bold font-mono">LV.{value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 每日任务专区 */}
        <div className="gaming-card border-gaming-accent/30 bg-gaming-accent/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gaming-accent">
              <Zap size={20} />
              今日必做 (每日任务)
            </h3>
            <button 
              onClick={() => refreshDailyQuests()}
              className="px-3 py-1.5 bg-gaming-accent/10 hover:bg-gaming-accent text-gaming-accent hover:text-black border border-gaming-accent/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              领取新任务
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dailyQuests.map(quest => (
              <div 
                key={quest.id} 
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer group",
                  quest.completed 
                    ? "bg-gaming-accent/10 border-gaming-accent/20 opacity-60" 
                    : "bg-white/5 border-white/10 hover:border-gaming-accent/50"
                )}
                onClick={() => !quest.completed && completeQuest(quest.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    quest.completed ? "bg-gaming-accent text-black" : "bg-white/10 text-gray-400 group-hover:text-gaming-accent"
                  )}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                    {quest.difficulty === 'EASY' ? '简单' : quest.difficulty === 'MEDIUM' ? '中等' : quest.difficulty === 'HARD' ? '困难' : '史诗'}
                  </span>
                </div>
                <h4 className={cn("font-bold text-sm mb-1", quest.completed && "line-through")}>{quest.title}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-2">{quest.description}</p>
              </div>
            ))}
            {dailyQuests.length === 0 && (
              <div className="col-span-3 py-8 text-center text-gray-500 italic text-sm">
                还没有每日任务？去“任务库”领取或手动创建一个吧！
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="gaming-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-gaming-accent" size={18} />
              近期成就
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded bg-gaming-accent/20 flex items-center justify-center text-gaming-accent">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">早起鸟</div>
                    <div className="text-[10px] text-gray-500">在早上8点前完成一项任务</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="gaming-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ScrollText className="text-gaming-accent-pink" size={18} />
              优先任务
            </h3>
            <div className="space-y-3">
              {activeQuests.slice(0, 3).map(quest => (
                <div key={quest.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium truncate">{quest.title}</span>
                  <div className="px-2 py-0.5 rounded bg-gaming-accent/10 border border-gaming-accent/20 text-[10px] text-gaming-accent">
                    {quest.difficulty === 'EASY' ? '简单' : quest.difficulty === 'MEDIUM' ? '中等' : quest.difficulty === 'HARD' ? '困难' : '史诗'}
                  </div>
                </div>
              ))}
              {activeQuests.length === 0 && <div className="text-sm text-gray-500 italic">暂无活跃任务。好好休息。</div>}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="gaming-card text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gaming-accent p-1 relative">
            <div className="w-full h-full rounded-full overflow-hidden bg-gaming-accent/20">
              <img src={stats.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gaming-accent text-black font-bold text-xs rounded-full">
              等级 {stats.level}
            </div>
          </div>
          <h2 className="text-2xl font-bold">Zero1Pine</h2>
          <p className="text-gray-400 text-sm">传奇拖延症杀手</p>
        </div>

        <div className="gaming-card">
          <h3 className="text-lg font-bold mb-4">每日签到</h3>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div key={day} className={cn(
                "w-8 h-8 rounded flex items-center justify-center text-xs font-bold",
                day <= 4 ? "bg-gaming-accent text-black" : "bg-white/5 text-gray-500"
              )}>
                {day}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">已连续 4 天！继续保持！</p>
        </div>
      </motion.div>
    </div>
  );
};

import { QUEST_LIBRARY } from './constants/questLibrary';

const Quests = () => {
  const { quests, addQuest, completeQuest, undoQuest, deleteQuest } = useGame();
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'library'>('active');
  const [newQuest, setNewQuest] = useState({ 
    title: '', 
    description: '', 
    difficulty: 'MEDIUM' as Difficulty, 
    category: 'STRENGTH' as Quest['category'],
    isDaily: false 
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuest.title) return;
    addQuest(newQuest.title, newQuest.description, newQuest.difficulty, newQuest.category, newQuest.isDaily);
    setNewQuest({ title: '', description: '', difficulty: 'MEDIUM', category: 'STRENGTH', isDaily: false });
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-32 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">任务日志</h1>
          <p className="text-gray-400">管理你的每日挑战并赢取奖励。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
            <button 
              onClick={() => setActiveTab('active')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === 'active' ? "bg-gaming-accent text-black" : "text-gray-500 hover:text-white"
              )}
            >
              进行中
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === 'library' ? "bg-gaming-accent text-black" : "text-gray-500 hover:text-white"
              )}
            >
              任务库
            </button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gaming-accent text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            新任务
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={handleAdd} className="gaming-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">任务标题</label>
                  <input 
                    type="text" 
                    value={newQuest.title}
                    onChange={e => setNewQuest({...newQuest, title: e.target.value})}
                    placeholder="输入任务名称..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">难度</label>
                  <select 
                    value={newQuest.difficulty}
                    onChange={e => setNewQuest({...newQuest, difficulty: e.target.value as Difficulty})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent transition-colors appearance-none"
                  >
                    <option value="EASY">简单 (10 XP)</option>
                    <option value="MEDIUM">中等 (25 XP)</option>
                    <option value="HARD">困难 (60 XP)</option>
                    <option value="EPIC">史诗 (150 XP)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">简述</label>
                <input 
                  type="text" 
                  value={newQuest.description}
                  onChange={e => setNewQuest({...newQuest, description: e.target.value})}
                  placeholder="简单描述一下这个任务..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">类别</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'STRENGTH', label: '力量' },
                    { id: 'INTELLIGENCE', label: '智力' },
                    { id: 'AGILITY', label: '敏捷' },
                    { id: 'CHARISMA', label: '魅力' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewQuest({...newQuest, category: cat.id as any})}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-xs font-bold transition-all",
                        newQuest.category === cat.id ? "bg-gaming-accent/20 border-gaming-accent text-gaming-accent" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div 
                    onClick={() => setNewQuest({...newQuest, isDaily: !newQuest.isDaily})}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      newQuest.isDaily ? "bg-gaming-accent border-gaming-accent text-black" : "border-white/20 group-hover:border-white/40"
                    )}
                  >
                    {newQuest.isDaily && <CheckCircle2 size={14} />}
                  </div>
                  <span className="text-sm font-bold">设置为每日重复任务</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-gaming-accent text-black font-bold rounded-lg">创建任务</button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 bg-white/5 text-white font-bold rounded-lg border border-white/10">取消</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {activeTab === 'active' ? (
          <>
            {quests.length === 0 && (
              <div className="text-center py-20 gaming-card opacity-50">
                <ScrollText size={48} className="mx-auto mb-4 text-gray-600" />
                <p>任务日志为空。添加一个新任务开始吧。</p>
              </div>
            )}
            
            {quests.map((quest) => (
              <motion.div 
                layout
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "gaming-card flex items-center justify-between group",
                  quest.completed && "opacity-50 grayscale"
                )}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => quest.completed ? undoQuest(quest.id) : completeQuest(quest.id)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                      quest.completed ? "bg-gaming-accent border-gaming-accent text-black" : "border-white/20 hover:border-gaming-accent text-transparent hover:text-gaming-accent/50"
                    )}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <div>
                    <h3 className={cn("font-bold text-lg", quest.completed && "line-through")}>{quest.title}</h3>
                    {quest.description && <p className="text-xs text-gray-500 mb-1">{quest.description}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      {quest.isDaily && (
                        <span className="px-1.5 py-0.5 rounded bg-gaming-accent/10 border border-gaming-accent/20 text-[9px] font-bold text-gaming-accent">
                          每日
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-gaming-accent-blue">
                        {quest.category === 'STRENGTH' ? '力量' : quest.category === 'INTELLIGENCE' ? '智力' : quest.category === 'AGILITY' ? '敏捷' : '魅力'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest",
                        quest.difficulty === 'EPIC' ? "text-gaming-accent-pink" : "text-gray-500"
                      )}>
                        {quest.difficulty === 'EASY' ? '简单' : quest.difficulty === 'MEDIUM' ? '中等' : quest.difficulty === 'HARD' ? '困难' : '史诗'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono text-gaming-accent">+{quest.xpReward} XP</div>
                    <div className="text-xs font-mono text-yellow-500">+{quest.goldReward} G</div>
                  </div>
                  <button 
                    onClick={() => deleteQuest(quest.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUEST_LIBRARY.map((template, idx) => (
              <div key={idx} className="gaming-card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{template.title}</h3>
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10",
                      template.difficulty === 'EPIC' ? "text-gaming-accent-pink border-gaming-accent-pink/30" : "text-gray-400"
                    )}>
                      {template.difficulty === 'EASY' ? '简单' : template.difficulty === 'MEDIUM' ? '中等' : template.difficulty === 'HARD' ? '困难' : '史诗'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{template.description}</p>
                </div>
                <button 
                  onClick={() => {
                    addQuest(template.title, template.description, template.difficulty, template.category, template.isDaily);
                    setActiveTab('active');
                  }}
                  className="w-full py-2 bg-gaming-accent/10 hover:bg-gaming-accent text-gaming-accent hover:text-black border border-gaming-accent/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  接受任务
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Skills = () => {
  const { stats } = useGame();
  
  const skillNames: Record<string, string> = {
    STRENGTH: '力量',
    INTELLIGENCE: '智力',
    AGILITY: '敏捷',
    CHARISMA: '魅力'
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-32 px-6">
      <h1 className="text-4xl font-bold mb-2">技能树</h1>
      <p className="text-gray-400 mb-12">可视化你在不同领域的成长。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(stats.skills).map(([skill, value]) => (
          <div key={skill} className="gaming-card relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sword size={120} />
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gaming-accent">{skillNames[skill] || skill}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">精通等级</p>
              </div>
              <div className="text-4xl font-mono font-black">{value}</div>
            </div>
            
            <div className="space-y-4">
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gaming-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(value % 10) * 10}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                <span>当前进度</span>
                <span>距离下一阶还需 {10 - (value % 10)} 点</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={cn(
                  "h-1 rounded-full",
                  i <= Math.floor(value / 5) ? "bg-gaming-accent" : "bg-white/10"
                )} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Inventory = () => (
  <div className="max-w-4xl mx-auto pt-32 pb-32 px-6">
    <h1 className="text-4xl font-bold mb-2">背包</h1>
    <p className="text-gray-400 mb-12">在旅途中收集的物品和神器。</p>
    
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="aspect-square gaming-card p-0 flex items-center justify-center relative group cursor-pointer">
          {i <= 3 ? (
            <div className="text-gaming-accent">
              <Backpack size={32} />
              <div className="absolute inset-0 bg-gaming-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
          ) : (
            <div className="text-gray-800">
              <Plus size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const Shop = () => {
  const { stats } = useGame();
  
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-32 px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">大集市</h1>
          <p className="text-gray-400">用你辛苦赚来的金币换取奖励。</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <Coins className="text-yellow-500" size={20} />
          <span className="font-mono font-bold text-yellow-500">{stats.gold}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: '生命药水', price: 50, desc: '立即恢复 20 点生命值。', icon: Heart },
          { name: '经验加成', price: 200, desc: '接下来的 3 个任务获得双倍经验。', icon: Zap },
          { name: '神秘宝箱', price: 150, desc: '包含一件随机装饰物品。', icon: Backpack },
          { name: '万能钥匙', price: 500, desc: '解锁隐藏的技能树分支。', icon: Sword },
        ].map(item => (
          <div key={item.name} className="gaming-card flex gap-6 group">
            <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-gaming-accent transition-colors">
              <item.icon size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{item.desc}</p>
              <button className="w-full py-2 bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 hover:border-yellow-500 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                <Coins size={14} />
                {item.price} 金币
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const { stats, updateAvatar } = useGame();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  
  const avatarSeeds = ['Felix', 'Aneka', 'Milo', 'Luna', 'Jasper', 'Zoe', 'Oscar', 'Maya'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-32 px-6">
      <div className="gaming-card mb-8 flex flex-col md:flex-row items-center gap-8 p-12">
        <div className="relative group">
          <div className="w-48 h-48 rounded-full border-8 border-gaming-accent p-1 overflow-hidden">
            <img src={stats.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
            <Plus className="text-gaming-accent" size={32} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl font-black mb-2">ZERO1PINE</h1>
          <p className="text-gaming-accent uppercase tracking-[0.3em] font-bold mb-6">时间大师</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-[10px] text-gray-500 uppercase">已完成任务</div>
              <div className="text-xl font-mono font-bold">142</div>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-[10px] text-gray-500 uppercase">总金币</div>
              <div className="text-xl font-mono font-bold">4,250</div>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-[10px] text-gray-500 uppercase">头衔</div>
              <div className="text-xl font-mono font-bold">精英</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <button 
          onClick={() => setIsEditingAvatar(!isEditingAvatar)}
          className="w-full py-4 gaming-card flex items-center justify-center gap-2 hover:border-gaming-accent transition-colors"
        >
          <UserIcon size={20} className="text-gaming-accent" />
          <span className="font-bold">更换预设头像</span>
        </button>
      </div>

      <AnimatePresence>
        {isEditingAvatar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="gaming-card mb-8 overflow-hidden"
          >
            <h3 className="text-lg font-bold mb-4">选择你的英雄</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {avatarSeeds.map(seed => {
                const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                return (
                  <button
                    key={seed}
                    onClick={() => {
                      updateAvatar(url);
                      setIsEditingAvatar(false);
                    }}
                    className={cn(
                      "aspect-square rounded-xl border-2 transition-all overflow-hidden",
                      stats.avatar === url ? "border-gaming-accent scale-110" : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <img src={url} alt={seed} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gaming-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <SettingsIcon size={20} className="text-gray-400" />
            账户设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">通知</span>
              <div className="w-12 h-6 bg-gaming-accent rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">深色模式</span>
              <div className="w-12 h-6 bg-gaming-accent rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
            <button className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
              重置游戏数据
            </button>
          </div>
        </div>
        
        <div className="gaming-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            名人堂
          </h3>
          <div className="space-y-4">
            {[
              { name: '建筑师', date: '2天前' },
              { name: '夜猫子', date: '1周前' },
              { name: '神级连胜', date: '2周前' },
            ].map(badge => (
              <div key={badge.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold">{badge.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{badge.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Content ---

const AppContent = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { showLevelUp, stats } = useGame();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'quests': return <Quests />;
      case 'skills': return <Skills />;
      case 'inventory': return <Inventory />;
      case 'shop': return <Shop />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Scene />
      <Header />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gaming-accent text-black p-12 rounded-3xl shadow-[0_0_50px_rgba(0,255,204,0.5)] text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Trophy size={80} className="mx-auto mb-4" />
              </motion.div>
              <h1 className="text-6xl font-black uppercase italic">等级提升!</h1>
              <p className="text-2xl font-bold mt-2">你达到了等级 {stats.level}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Mouse Interaction Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(0,255,204,0.05)_0%,transparent_50%)]" />
      </div>
    </div>
  );
};

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

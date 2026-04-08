import { Difficulty, Quest } from '../types';

export interface QuestTemplate {
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Quest['category'];
  isDaily?: boolean;
}

export const QUEST_LIBRARY: QuestTemplate[] = [
  // 力量 (STRENGTH) - 大学生版
  { title: '早起晨跑', description: '在操场跑3圈，开启活力一天。', difficulty: 'MEDIUM', category: 'STRENGTH', isDaily: true },
  { title: '宿舍大扫除', description: '彻底清理宿舍卫生，创造舒适环境。', difficulty: 'HARD', category: 'STRENGTH' },
  { title: '步行上课', description: '今天不骑车不坐车，步行去教学楼。', difficulty: 'EASY', category: 'STRENGTH', isDaily: true },
  { title: '健身房打卡', description: '在校健身房完成1小时力量训练。', difficulty: 'HARD', category: 'STRENGTH' },
  { title: '拒绝外卖', description: '今天去食堂吃健康的一餐，不点外卖。', difficulty: 'MEDIUM', category: 'STRENGTH', isDaily: true },
  { title: '冷水脸挑战', description: '早起用冷水洗脸，瞬间清醒。', difficulty: 'EASY', category: 'STRENGTH', isDaily: true },
  { title: '深蹲挑战', description: '在宿舍完成50个深蹲。', difficulty: 'MEDIUM', category: 'STRENGTH', isDaily: true },
  { title: '楼梯挑战', description: '今天不坐电梯，全部走楼梯。', difficulty: 'MEDIUM', category: 'STRENGTH', isDaily: true },
  { title: '平板支撑', description: '坚持平板支撑2分钟。', difficulty: 'EASY', category: 'STRENGTH', isDaily: true },
  { title: '校园远征', description: '步行探索一个你从未去过的校园角落。', difficulty: 'MEDIUM', category: 'STRENGTH' },
  
  // 智力 (INTELLIGENCE) - 大学生版
  { title: '图书馆沉浸', description: '在图书馆专注学习2小时，不看手机。', difficulty: 'HARD', category: 'INTELLIGENCE', isDaily: true },
  { title: '课后复习', description: '整理今天的课堂笔记，消化知识点。', difficulty: 'MEDIUM', category: 'INTELLIGENCE', isDaily: true },
  { title: '英语单词打卡', description: '背诵并掌握50个新单词。', difficulty: 'MEDIUM', category: 'INTELLIGENCE', isDaily: true },
  { title: '论文初稿', description: '完成论文的一个章节或1000字。', difficulty: 'EPIC', category: 'INTELLIGENCE' },
  { title: '纪录片之夜', description: '观看一部有深度的纪录片并写下感悟。', difficulty: 'MEDIUM', category: 'INTELLIGENCE' },
  { title: '代码Debug', description: '解决那个困扰你很久的程序Bug。', difficulty: 'HARD', category: 'INTELLIGENCE' },
  { title: '知乎/B站学习', description: '在知识类平台观看一个专业相关的教学视频。', difficulty: 'EASY', category: 'INTELLIGENCE', isDaily: true },
  { title: '数字排毒', description: '连续4小时不使用任何社交媒体。', difficulty: 'HARD', category: 'INTELLIGENCE', isDaily: true },
  { title: '思维导图', description: '为本周最难的一门课画一张思维导图。', difficulty: 'MEDIUM', category: 'INTELLIGENCE' },
  
  // 敏捷 (AGILITY) - 大学生版
  { title: '高效作业', description: '在1小时内高质量完成一项课后作业。', difficulty: 'MEDIUM', category: 'AGILITY', isDaily: true },
  { title: '社团活动协调', description: '快速处理社团内的3项协调工作。', difficulty: 'MEDIUM', category: 'AGILITY' },
  { title: '邮件/通知清理', description: '处理完所有教务系统和班群的通知。', difficulty: 'EASY', category: 'AGILITY', isDaily: true },
  { title: '竞赛准备', description: '为即将到来的比赛准备一个完整的模块。', difficulty: 'HARD', category: 'AGILITY' },
  { title: '闪电整理', description: '在5分钟内把乱糟糟的书桌收拾干净。', difficulty: 'EASY', category: 'AGILITY', isDaily: true },
  { title: '准时到达', description: '今天所有的课和约会都提前5分钟到达。', difficulty: 'MEDIUM', category: 'AGILITY', isDaily: true },
  { title: '番茄钟挑战', description: '完成4个完整的番茄工作周期。', difficulty: 'MEDIUM', category: 'AGILITY', isDaily: true },
  { title: '宿舍大厨', description: '只用电饭煲或微波炉做出一顿像样的饭。', difficulty: 'MEDIUM', category: 'AGILITY' },
  
  // 魅力 (CHARISMA) - 大学生版
  { title: '课堂发言', description: '在课堂上主动举手回答问题或参与讨论。', difficulty: 'MEDIUM', category: 'CHARISMA', isDaily: true },
  { title: '组队协作', description: '组织一次小组讨论并达成共识。', difficulty: 'HARD', category: 'CHARISMA' },
  { title: '新朋友结识', description: '在食堂或图书馆主动认识一位新同学。', difficulty: 'MEDIUM', category: 'CHARISMA' },
  { title: '志愿者服务', description: '参与一次校园志愿者活动。', difficulty: 'HARD', category: 'CHARISMA' },
  { title: '赞美他人', description: '真诚地夸奖三位同学或朋友。', difficulty: 'EASY', category: 'CHARISMA', isDaily: true },
  { title: '社恐挑战', description: '在公共场合主动询问路人一个问题。', difficulty: 'MEDIUM', category: 'CHARISMA' },
  { title: '给家里打个电话', description: '和父母聊聊天，分享一下近况。', difficulty: 'MEDIUM', category: 'CHARISMA', isDaily: true },
  { title: '匿名善意', description: '给室友留一张鼓励的小纸条或一份小零食。', difficulty: 'EASY', category: 'CHARISMA' },
];

import { GuidanceMessage } from "./types";

// 预设引导语模板库
export const guidanceMessages: GuidanceMessage[] = [
  // 学习类
  {
    id: "study-1",
    category: "学习",
    type: "start",
    message: "只需要开始5分钟，你会发现学习其实很有趣！"
  },
  {
    id: "study-2",
    category: "学习",
    type: "motivation",
    message: "坚持100天，你将拥有全新的专业能力！"
  },
  {
    id: "study-3",
    category: "学习",
    type: "achievement",
    message: "每一天的学习都在为更好的自己添砖加瓦！"
  },
  {
    id: "study-4",
    category: "学习",
    type: "reminder",
    message: "今天的学习时间已经到了，开始吧！"
  },

  // 健身类
  {
    id: "fitness-1",
    category: "健身",
    type: "start",
    message: "穿上运动鞋，只需20分钟，身体会感谢你！"
  },
  {
    id: "fitness-2",
    category: "健身",
    type: "motivation",
    message: "每一次锻炼都是对自己最好的投资！"
  },
  {
    id: "fitness-3",
    category: "健身",
    type: "achievement",
    message: "你的身体正在变得更强壮，继续加油！"
  },
  {
    id: "fitness-4",
    category: "健身",
    type: "reminder",
    message: "今天的运动在等你，别让身体失望！"
  },

  // 写作类
  {
    id: "writing-1",
    category: "写作",
    type: "start",
    message: "写下第一句话，灵感就会自然流淌！"
  },
  {
    id: "writing-2",
    category: "写作",
    type: "motivation",
    message: "每天进步一点点，一年后你会惊讶于自己的成长！"
  },
  {
    id: "writing-3",
    category: "写作",
    type: "achievement",
    message: "你的文字正在产生影响力，继续创作！"
  },
  {
    id: "writing-4",
    category: "写作",
    type: "reminder",
    message: "今天想要表达什么？开始写作吧！"
  },

  // 通用类
  {
    id: "general-1",
    category: "通用",
    type: "start",
    message: "千里之行，始于足下。现在就开始！"
  },
  {
    id: "general-2",
    category: "通用",
    type: "motivation",
    message: "你已经连续X天了，今天继续保持！"
  },
  {
    id: "general-3",
    category: "通用",
    type: "achievement",
    message: "每一个完成的任务都在拉近你和目标的距离！"
  },
  {
    id: "general-4",
    category: "通用",
    type: "reminder",
    message: "今天的任务在等待你，行动起来！"
  },
  {
    id: "general-5",
    category: "通用",
    type: "start",
    message: "最好的时间是现在，不要等待！"
  },
  {
    id: "general-6",
    category: "通用",
    type: "motivation",
    message: "成功不是终点，持续行动才是！"
  },
  {
    id: "general-7",
    category: "通用",
    type: "achievement",
    message: "你的坚持正在改变一切！"
  },
  {
    id: "general-8",
    category: "通用",
    type: "reminder",
    message: "今天的努力是明天的收获！"
  }
];

/**
 * 根据类别获取引导语
 * @param category 目标类别
 * @param type 引导语类型
 * @param currentStreak 当前连续天数（用于个性化）
 * @returns 匹配的引导语
 */
export function getGuidanceMessage(
  category: string,
  type: 'start' | 'motivation' | 'achievement' | 'reminder',
  currentStreak?: number
): string {
  // 首先尝试获取匹配类别和类型的引导语
  let messages = guidanceMessages.filter(
    msg => msg.category === category && msg.type === type
  );

  // 如果没有找到，使用通用类别的引导语
  if (messages.length === 0) {
    messages = guidanceMessages.filter(
      msg => msg.category === "通用" && msg.type === type
    );
  }

  // 如果还是没有，返回通用引导语
  if (messages.length === 0) {
    messages = guidanceMessages.filter(msg => msg.category === "通用");
  }

  // 随机选择一条
  const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

  // 替换模板中的变量
  let message = selectedMessage.message;
  if (currentStreak !== undefined && currentStreak > 0) {
    message = message.replace("X天", `${currentStreak}天`);
  }

  return message;
}

/**
 * 获取任务开始时的引导语
 */
export function getStartGuidance(category: string, currentStreak?: number): string {
  return getGuidanceMessage(category, 'start', currentStreak);
}

/**
 * 获取激励性引导语
 */
export function getMotivationalGuidance(category: string, currentStreak?: number): string {
  return getGuidanceMessage(category, 'motivation', currentStreak);
}

/**
 * 获取成就类引导语
 */
export function getAchievementGuidance(category: string, currentStreak?: number): string {
  return getGuidanceMessage(category, 'achievement', currentStreak);
}

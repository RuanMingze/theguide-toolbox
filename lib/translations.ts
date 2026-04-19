// 翻译服务 - 预设英文翻译

export interface TranslationResult {
  translatedText: string
}

// 页面可翻译文本键值对（中文原文作为 key）
export const translatableTexts: string[] = [
  // 首页
  '欢迎回来',
  '欢迎使用',
  '工具箱',
  
  // 问候语
  '早上好',
  '上午好',
  '中午好',
  '下午好',
  '晚上好',
  '夜深了',
  
  // 导航
  '首页',
  '网站导航',
  '实用工具',
  '我的收藏',
  '设置',
  '登录',
  '退出',
  
  // 日历
  '加载中...',
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '年',
  
  // 快捷入口
  '快捷入口',
  '精选 100+ 优质网站，快速访问',
  '70+ 在线工具，提升效率',
  '快速访问收藏的工具和网站',
  '网站导航',
  '实用工具',
  '我的收藏',
  
  // 天气
  '正在获取位置...',
  '湿度',
  '风速',
  '体感',
  '未来天气',
  '明天',
  '后天',
  '今天',
  
  // 节日
  '到了！',
  '节日快乐！',
  
  // 设置
  '设置',
  '自定义您的个性化设置',
  '壁纸设置',
  '无',
  '渐变',
  '上传图片',
  '上传成功',
  '上传失败',
  '请上传图片文件',
  '毛玻璃效果',
  '毛玻璃颜色',
  '毛玻璃透明度',
  '图片 URL',
  '提交',
  '重置设置',
  '已保存',
  '设置已保存，刷新页面后生效',
  '预设壁纸',
  '自定义壁纸',
  '图片链接',
  '点击上传图片',
  '支持 JPG、PNG、GIF 等格式',
  '当前自定义壁纸',
  '清除',
  '毛玻璃特效',
  '透明度',
  '预览',
  '重置为默认设置',
  '设置已自动保存',
  '液体玻璃',
  '实验性',
  'iOS 26 风格的液体玻璃效果',
  '液体玻璃开启时不可用',
]

// 节日数据库英文翻译
export const festivalTranslations: Record<string, { name: string; description: string }> = {
  // 公历节日
  "0-1": { name: "New Year's Day", description: "New Year's Day, January 1st in the Gregorian calendar, is a holiday celebrated in most countries around the world as the beginning of the new year." },
  "2-8": { name: "International Women's Day", description: "International Women's Day, officially recognized by the United Nations, celebrates the social, economic, cultural, and political achievements of women." },
  "2-12": { name: "Arbor Day", description: "Arbor Day is a holiday in which individuals and groups are encouraged to plant trees. It promotes environmental awareness and the importance of tree planting." },
  "4-4": { name: "Tomb Sweeping Day", description: "Tomb Sweeping Day, also known as Qingming Festival, is a traditional Chinese festival for honoring ancestors and sweeping their tombs." },
  "4-5": { name: "Tomb Sweeping Day", description: "Tomb Sweeping Day, also known as Qingming Festival, is a traditional Chinese festival for honoring ancestors and sweeping their tombs." },
  "5-1": { name: "International Workers' Day", description: "International Workers' Day, also known as Labour Day or May Day, is celebrated on May 1st in many countries around the world to honor workers and their contributions." },
  "5-4": { name: "Youth Day", description: "Youth Day commemorates the May Fourth Movement of 1919, a patriotic movement that marked the beginning of China's new democratic revolution." },
  "5-12": { name: "International Nurses Day", description: "International Nurses Day is celebrated on May 12th to honor Florence Nightingale, the founder of modern nursing, and recognize the contributions of nurses worldwide." },
  "6-1": { name: "Children's Day", description: "International Children's Day is celebrated on June 1st to promote children's rights, welfare, and well-being worldwide." },
  "7-1": { name: "Founding Day of the Communist Party of China", description: "July 1st marks the founding anniversary of the Communist Party of China, established in 1921." },
  "8-1": { name: "Army Day", description: "Army Day, celebrated on August 1st, commemorates the founding of the People's Liberation Army of China." },
  "9-10": { name: "Teachers' Day", description: "Teachers' Day in China is celebrated on September 10th to honor teachers and their contributions to education." },
  "10-1": { name: "National Day", description: "National Day of the People's Republic of China is celebrated on October 1st to commemorate the founding of the nation in 1949." },
  "11-25": { name: "International Day for the Elimination of Violence against Women", description: "This UN observance day, established in 1999, raises awareness about violence against women and promotes action to end it." },
  "12-25": { name: "Christmas Day", description: "Christmas Day, celebrated on December 25th, is a Christian holiday commemorating the birth of Jesus Christ and is widely celebrated around the world." },
  
  // 农历节日
  "lunar-1-1": { name: "Spring Festival", description: "Spring Festival, also known as Chinese New Year, is the most important traditional festival in China, marking the beginning of the lunar new year." },
  "lunar-1-15": { name: "Lantern Festival", description: "The Lantern Festival, celebrated on the 15th day of the first lunar month, marks the end of the Spring Festival celebrations with lantern displays and family gatherings." },
  "lunar-5-5": { name: "Dragon Boat Festival", description: "Dragon Boat Festival, celebrated on the 5th day of the 5th lunar month, commemorates the poet Qu Yuan and features dragon boat races and zongzi (sticky rice dumplings)." },
  "lunar-7-7": { name: "Qixi Festival", description: "Qixi Festival, also known as Chinese Valentine's Day, falls on the 7th day of the 7th lunar month and celebrates the annual meeting of the cowherd and weaver girl in legend." },
  "lunar-8-15": { name: "Mid-Autumn Festival", description: "Mid-Autumn Festival, celebrated on the 15th day of the 8th lunar month, is a time for family reunions, moon gazing, and eating mooncakes." },
  "lunar-9-9": { name: "Double Ninth Festival", description: "Double Ninth Festival, on the 9th day of the 9th lunar month, is a traditional Chinese holiday for respecting the elderly and climbing mountains." },
  "lunar-12-8": { name: "Laba Festival", description: "Laba Festival, celebrated on the 8th day of the 12th lunar month, is a traditional Chinese holiday where people eat Laba porridge to pray for good harvest." },
  "lunar-12-30": { name: "Chinese New Year's Eve", description: "Chinese New Year's Eve, the last day of the lunar year, is when families gather for reunion dinner and stay up late to welcome the new year." },
}

// 预设英文翻译
export const englishTranslations: Record<string, string> = {
  // 首页
  '欢迎回来': 'Welcome back',
  '欢迎使用': 'Welcome to',
  '工具箱': 'Toolbox',
  
  // 问候语
  '早上好': 'Good morning',
  '上午好': 'Good morning',
  '中午好': 'Good afternoon',
  '下午好': 'Good afternoon',
  '晚上好': 'Good evening',
  '夜深了': 'Good night',
  
  // 导航
  '首页': 'Home',
  '网站导航': 'Guide',
  '实用工具': 'Tools',
  '我的收藏': 'Favorites',
  '设置': 'Settings',
  '登录': 'Login',
  '退出': 'Logout',
  
  // 日历
  '加载中...': 'Loading...',
  '一月': 'January',
  '二月': 'February',
  '三月': 'March',
  '四月': 'April',
  '五月': 'May',
  '六月': 'June',
  '七月': 'July',
  '八月': 'August',
  '九月': 'September',
  '十月': 'October',
  '十一月': 'November',
  '十二月': 'December',
  '日': 'Sun',
  '一': 'Mon',
  '二': 'Tue',
  '三': 'Wed',
  '四': 'Thu',
  '五': 'Fri',
  '六': 'Sat',
  '年': 'Year',
  
  // 快捷入口
  '快捷入口': 'Quick Access',
  '精选 100+ 优质网站，快速访问': '100+ quality websites for quick access',
  '70+ 在线工具，提升效率': '70+ online tools to boost efficiency',
  '快速访问收藏的工具和网站': 'Quick access to your favorite tools and websites',
  
  // 天气
  '正在获取位置...': 'Getting location...',
  '湿度': 'Humidity',
  '风速': 'Wind',
  '体感': 'Feels like',
  '未来天气': 'Forecast',
  '明天': 'Tomorrow',
  '后天': 'Day after',
  '今天': 'Today',
  
  // 节日
  '到了！': 'is here!',
  '节日快乐！': 'Happy holiday!',
  
  // 设置
  '自定义您的个性化设置': 'Customize your personal settings',
  '壁纸设置': 'Wallpaper',
  '无': 'None',
  '渐变': 'Gradient',
  '上传图片': 'Upload Image',
  '上传成功': 'Upload successful',
  '上传失败': 'Upload failed',
  '请上传图片文件': 'Please upload an image file',
  '毛玻璃效果': 'Glassmorphism',
  '毛玻璃颜色': 'Glass color',
  '毛玻璃透明度': 'Glass opacity',
  '图片 URL': 'Image URL',
  '提交': 'Submit',
  '重置设置': 'Reset Settings',
  '已保存': 'Saved',
  '设置已保存，刷新页面后生效': 'Settings saved, refresh page to apply',
  '液体玻璃': 'Liquid Glass',
  '实验性': 'Experimental',
  'iOS 26 风格的液体玻璃效果': 'iOS 26 style liquid glass effect',
  '液体玻璃开启时不可用': 'Disabled when Liquid Glass is on',
}

// 检测用户语言
export function detectUserLanguage(acceptLanguage?: string): string {
  if (!acceptLanguage) {
    // 客户端检测
    acceptLanguage = typeof navigator !== 'undefined' ? navigator.language : 'zh-CN'
  }
  
  // 解析 Accept-Language 头
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, quality = 'q=1'] = lang.trim().split(';')
    const q = parseFloat(quality.split('=')[1]) || 1
    return { code, q }
  })
  
  // 按质量排序
  languages.sort((a, b) => b.q - a.q)
  
  // 检查是否包含中文
  const hasChinese = languages.some(lang => 
    lang.code.toLowerCase().includes('zh') || 
    lang.code.toLowerCase().includes('cn') ||
    lang.code.toLowerCase().includes('tw') ||
    lang.code.toLowerCase().includes('hk')
  )
  
  // 如果用户语言包含中文，返回中文
  if (hasChinese) {
    return 'zh'
  }
  
  // 否则返回英文
  return 'en'
}

// 使用预设翻译翻译文本
export function translateText(text: string, source: string = 'zh', target: string = 'en'): string {
  // 如果源和目标相同，直接返回
  if (source === target) {
    return text
  }
  
  // 如果是中文转英文，使用预设翻译
  if (source === 'zh' && target === 'en') {
    return englishTranslations[text] || text
  }
  
  // 如果是英文转中文，反向查找
  if (source === 'en' && target === 'zh') {
    for (const [zh, en] of Object.entries(englishTranslations)) {
      if (en === text) {
        return zh
      }
    }
    return text
  }
  
  return text
}

// 批量翻译文本
export function batchTranslate(texts: string[], source: string, target: string): Record<string, string> {
  const translationMap: Record<string, string> = {}
  texts.forEach(text => {
    translationMap[text] = translateText(text, source, target)
  })
  return translationMap
}

// 获取翻译
export function getTranslation(text: string, targetLang: string): string {
  // 如果是中文，直接返回
  if (targetLang === 'zh') {
    return text
  }
  
  // 使用预设翻译
  return translateText(text, 'zh', targetLang)
}

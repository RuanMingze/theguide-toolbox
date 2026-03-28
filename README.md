# TheGuide 工具箱

您的一站式效率工具与网站导航平台

## 🌟 功能特性

### 📝 文本工具
- 字数统计 - 统计文本字数、字符数、行数
- 大小写转换 - 转换文本大小写格式
- 文本对比 - 比较两段文本的差异
- 批量替换 - 批量查找替换文本内容
- 文本反转 - 反转文本字符顺序
- 去除重复行 - 删除重复的文本行
- 文本排序 - 按字母或数字排序文本行

### 🔧 编码转换
- Base64 编解码 - 文本与 Base64 互转
- URL 编解码 - URL 编码与解码
- Unicode 转换 - Unicode 编码转换
- HTML 实体转换 - HTML 特殊字符转义
- JSON 格式化 - 格式化和校验 JSON
- 进制转换 - 二进制、八进制、十进制、十六进制互转
- ASCII 转换 - 字符与 ASCII 码互转

### 🖼️ 图片工具
- 图片压缩 - 压缩图片文件大小
- 图片调整 - 调整图片尺寸大小
- 图片旋转 - 自定义角度旋转图片（0-360°）
- 图片滤镜 - 8 种滤镜效果（怀旧、黑白、模糊、亮度、对比度、饱和度、色相旋转、反色）
- 黑白转换 - 彩色图片转黑白
- 背景透明 - 移除图片背景使之透明
- 图片转 Base64 - 图片转换为 Base64 编码

### 📄 格式转换
- 文件格式转换 - DOCX/PDF转TXT/MD，纯本地处理，保护隐私

### 🎲 生成器
- 密码生成器 - 生成安全随机密码
- UUID 生成器 - 生成唯一识别码 UUID
- 二维码生成 - 生成自定义二维码
- Lorem 生成器 - 生成占位文本
- 随机颜色 - 生成随机颜色代码

### 🧮 计算工具
- 科学计算器 - 支持高级数学运算
- 单位换算 - 长度、重量、温度等单位转换
- 百分比计算 - 计算百分比和比例
- 日期计算 - 计算日期差和日期加减
- 时间戳转换 - Unix 时间戳与日期互转
- BMI 计算器 - 计算身体质量指数

### 🎨 颜色工具
- 取色器 - 选择和提取颜色
- 颜色转换 - HEX、RGB、HSL 互转
- 渐变生成器 - 创建 CSS 渐变效果

### 🌤️ 生活服务
- 实时时钟 - 显示当前时间和日期
- 日历 - 查看日历信息
- 天气预报 - 自动定位获取天气信息（支持 OpenWeather API）

## 🚀 技术栈

- **框架**: Next.js 16.2.0
- **前端**: React 19.2.4, TypeScript
- **样式**: Tailwind CSS v4
- **UI 组件**: Radix UI, shadcn/ui
- **部署**: Cloudflare Pages
- **包管理器**: pnpm

## 📦 安装依赖

```bash
pnpm install
```

## 🛠️ 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 🌐 环境变量

创建 `.env.local` 文件并添加以下环境变量：

```env
# OpenWeather API Key (用于天气预报功能)
OPENWEATHER_API_KEY=your_api_key_here

# Ruanm OAuth (用于用户登录功能)
RUANM_OAUTH_CLIENT_ID=your_client_id
RUANM_OAUTH_CLIENT_SECRET=your_client_secret
RUANM_OAUTH_REDIRECT_URI=https://your-domain.com/callback
RUANM_OAUTH_BASE_URL=https://ruanmgjx.dpdns.org
```

获取 API Key: [OpenWeather](https://openweathermap.org/api)

### OAuth 配置说明

1. 在 Ruanm 平台创建 OAuth 应用
2. 设置回调地址为 `https://your-domain.com/callback`
3. 将 Client ID 和 Client Secret 填入环境变量
4. 用户登录后可以访问个性化功能

### 温馨提醒
实际生产环境已经配置好env了，无需手动配置。

## 📱 特点

- ✅ **纯前端架构** - 所有工具都在浏览器本地运行
- ✅ **隐私保护** - 文件和数据不上传，完全在本地处理
- ✅ **快速响应** - 无需网络请求，即时处理
- ✅ **免费部署** - 可部署到 Cloudflare Pages，零成本
- ✅ **响应式设计** - 支持桌面和移动端
- ✅ **用户登录** - 支持 Ruanm OAuth 2.0 登录

## 🔒 隐私说明

本工具箱采用纯前端架构，所有数据处理都在用户浏览器本地完成：

- 不上传任何文件到服务器
- 不收集任何用户数据
- 不使用 Cookie 追踪
- 所有工具都在客户端执行

## 📄 许可证

MIT License

## 👨‍💻 作者

RuanMingze（Ruanm）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
Issue 地址：https://github.com/RuanMingze/theguide-toolbox/issues

---

**TheGuide 工具箱** - 您的一站式效率工具与网站导航平台

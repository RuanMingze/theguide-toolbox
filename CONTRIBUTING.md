# 贡献指南 (Contributing Guide)

感谢你考虑为 TheGuide 工具箱做出贡献！我们欢迎各种形式的贡献，包括代码提交、问题报告、功能建议等。

## 目录

- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [问题报告](#问题报告)
- [功能建议](#功能建议)

---

## 开发环境设置

### 前置要求

- Node.js >= 18.x
- pnpm >= 8.x
- Git

### 安装步骤

1. **Fork 项目**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆项目**
   ```bash
   git clone https://github.com/RuanMingze/theguide-toolbox.git
   cd theguide-toolbox
   ```

3. **安装依赖**
   ```bash
   pnpm install
   ```

4. **配置环境变量**
   ```bash
   # 复制环境变量示例文件
   cp .env.example .env.local
   
   # 编辑 .env.local，填入你的配置
   # 必要配置：
   # - NEXT_PUBLIC_GITHUB_CLIENT_ID: GitHub OAuth Client ID
   # - GITHUB_CLIENT_SECRET: GitHub OAuth Client Secret
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

6. **构建项目**
   ```bash
   pnpm build
   ```

---

## 代码规范

### 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **图标**: Lucide React / Font Awesome

### 编码规范

1. **TypeScript**
   - 所有代码必须使用 TypeScript
   - 避免使用 `any`，使用明确的类型定义
   - 导出组件必须有明确的 Props 类型

2. **React 组件**
   ```typescript
   // 使用函数组件
   interface Props {
     title: string
     onClick?: () => void
   }

   export function MyComponent({ title, onClick }: Props) {
     return <div>{title}</div>
   }
   ```

3. **样式规范**
   - 使用 Tailwind CSS 进行样式编写
   - 遵循现有的设计系统和颜色变量
   - 响应式设计使用 Tailwind 的断点前缀（sm, md, lg, xl）

4. **文件命名**
   - 组件文件：kebab-case，如 `my-component.tsx`
   - 工具函数：kebab-case，如 `utils.ts`
   - 页面文件：`page.tsx`
   - 布局文件：`layout.tsx`

5. **禁止事项**
   - ❌ 禁止使用浏览器默认弹窗（alert/confirm/prompt）
   - ❌ 禁止使用 emoji（使用 Font Awesome 图标）
   - ❌ 禁止使用jsdelivr、和风天气等 CDN/API
   - ❌ 禁止在代码中硬编码敏感信息（API 密钥等）

---

## 提交规范

### Commit Message 格式

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 示例

```bash
feat(calendar): 添加农历节日支持
fix(auth): 修复登录回调问题
docs(readme): 更新安装说明
perf(image): 优化图片加载性能
```

### 提交前检查

```bash
# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint

# 运行测试
pnpm test
```

---

## Pull Request 流程

### 1. 创建分支

```bash
# 从 main 分支创建新分支
git checkout -b feat/your-feature-name
```

分支命名规范：
- `feat/xxx`: 新功能
- `fix/xxx`: Bug 修复
- `docs/xxx`: 文档更新
- `refactor/xxx`: 代码重构

### 2. 开发并提交

```bash
# 提交代码（遵循 Commit Message 规范）
git add .
git commit -m "feat: 添加 xxx 功能"

# 推送分支
git push origin feat/your-feature-name
```

### 3. 创建 Pull Request

1. 在 GitHub 上访问你的 fork 仓库
2. 点击 "Compare & pull request"
3. 填写 PR 描述：
   - 描述更改内容
   - 关联 Issue（如有）
   - 添加截图（UI 改动）
4. 等待 CI 检查通过
5. 等待代码审查

### 4. 代码审查

- 至少需要 1 个维护者批准
- 所有 CI 检查必须通过
- 根据审查意见进行修改

### 5. 合并

- PR 批准后由维护者合并
- 删除已合并的分支

---

## 问题报告

### 提交 Issue 前

- [ ] 搜索现有 Issue，避免重复
- [ ] 确认是项目问题而非环境问题
- [ ] 准备复现步骤

### Issue 模板

```markdown
### 问题描述
简要描述问题

### 复现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

### 期望行为
描述期望发生什么

### 实际行为
描述实际发生了什么

### 环境信息
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node.js: v18.x.x
- 版本：commit hash 或 release tag

### 截图
如有必要，添加截图
```

---

## 功能建议

### 提交建议前

- [ ] 确认该功能尚未存在
- [ ] 说明功能的使用场景
- [ ] 说明该功能带来的价值

### 建议模板

```markdown
### 功能描述
简要描述建议的功能

### 使用场景
说明在什么场景下需要这个功能

### 实现建议
如有想法，可以描述如何实现

### 替代方案
是否有其他替代解决方案
```

---

## 开发资源

### 项目结构

```
TheGuide-toolbox/
├── app/                 # Next.js App Router 页面
│   ├── page.tsx        # 首页
│   ├── guide/          # 导航页面
│   ├── tools/          # 工具页面
│   └── settings/       # 设置页面
├── components/          # React 组件
│   ├── ui/            # shadcn/ui 组件
│   └── ...            # 其他组件
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数
└── public/             # 静态资源
```

### 有用链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

---

## 社区行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经许可发布他人信息
- 其他不道德或不专业的行为

---

## 许可证

本项目采用 MIT 许可证。提交贡献即表示你同意你的贡献遵循相同的许可证。

---

## 联系方式

- GitHub Issues: [提交问题](https://github.com/RuanMingze/theguide-toolbox/issues)
- Email: [联系](mailto:xmt20160124@outlook.com)

感谢你的贡献！🎉

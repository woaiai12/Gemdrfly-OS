# Gemdrfly OS - AI驱动的行为操作系统

让持续行动变得更容易，而不是消耗意志力。

## 功能特性

- ✅ **用户认证** - 邮箱/密码登录 + Google OAuth
- 🎯 **目标管理** - 创建和管理个人目标
- 📋 **每日任务** - 自动生成每日可执行任务
- 🤖 **AI引导** - 智能激励系统（MVP阶段使用预设模板）
- 📊 **成长反馈** - 实时追踪进度和成就
- 🏆 **成就系统** - 解锁各种成就徽章

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: Ant Design
- **后端服务**: Firebase (Auth + Firestore)
- **AI服务**: 本地模拟（后期可扩展为真实API）
- **状态管理**: React Context
- **样式方案**: Ant Design + Tailwind CSS

## 快速开始

### 1. 克隆项目

\`\`\`bash
git clone <repository-url>
cd gemdrfly-os
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 3. 配置Firebase

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 启用 **Authentication**:
   - Email/Password
   - Google
4. 创建 **Firestore Database**:
   - 选择生产模式或测试模式
   - 设置以下Collections和规则：

**Firestore Security Rules**:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /goals/{goalId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /completions/{completionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
\`\`\`

5. 获取Firebase配置信息：
   - 项目设置 → 常规 → 您的应用
   - 复制配置信息

### 4. 配置环境变量

创建 `.env.local` 文件：

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 5. 运行开发服务器

\`\`\`bash
npm run dev
\`\`\`

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

\`\`\`
gemdrfly-os/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   │   ├── page.tsx        # 今日任务
│   │   ├── goals/          # 目标管理
│   │   └── progress/       # 成长进度
│   ├── layout.tsx
│   └── page.tsx            # 着陆页
├── components/             # 可复用组件
├── contexts/
│   └── AuthContext.tsx     # 认证上下文
├── lib/
│   ├── firebase.ts         # Firebase配置
│   ├── firestore.ts        # Firestore操作
│   ├── guidance.ts         # AI引导系统
│   └── types.ts            # TypeScript类型
└── middleware.ts           # 路由中间件
\`\`\`

## 数据模型

### Users Collection
\`\`\`typescript
{
  uid: string;
  email: string;
  createdAt: Date;
}
\`\`\`

### Goals Collection
\`\`\`typescript
{
  userId: string;
  title: string;
  dailyTime: number;        // 每日投入时间（分钟）
  category: string;         // 类别：学习、健身、写作等
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
}
\`\`\`

### Tasks Collection
\`\`\`typescript
{
  goalId: string;
  userId: string;
  date: Date;
  content: string;
  duration: number;         // 预计时长（分钟）
  completed: boolean;
  completedAt?: Date;
}
\`\`\`

### Completions Collection
\`\`\`typescript
{
  userId: string;
  taskId: string;
  goalId: string;
  completedAt: Date;
}
\`\`\`

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com/) 导入项目
3. 配置环境变量
4. 部署

## 待办事项

- [ ] 密码重置功能
- [ ] 邮箱验证
- [ ] 更多AI引导策略
- [ ] 数据可视化图表
- [ ] 深色模式
- [ ] PWA支持
- [ ] 推送通知
- [ ] 社交功能
- [ ] 多语言支持

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

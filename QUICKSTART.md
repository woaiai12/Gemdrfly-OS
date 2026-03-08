# Gemdrfly OS 快速启动指南

## ⚡ 5分钟快速开始

### 第一步：安装依赖
\`\`\`bash
npm install
\`\`\`

### 第二步：配置Firebase（3分钟）

1. **创建Firebase项目**
   - 访问 https://console.firebase.google.com/
   - 创建新项目

2. **启用Authentication**
   - 启用"Email/Password"登录
   - 启用"Google"登录

3. **创建Firestore Database**
   - 选择测试模式（开发阶段）
   - 或复制生产模式规则（见FIREBASE_SETUP.md）

4. **获取配置信息**
   - 项目设置 → 常规 → 您的应用
   - 复制firebase配置

5. **设置环境变量**
   - 复制`.env.local`文件
   - 填入你的Firebase配置

### 第三步：运行应用
\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

## 🎯 核心功能

### 1. 创建目标
- 点击右上角"我的目标"
- 点击"创建目标"
- 输入目标信息（标题、类别、每日时间）

### 2. 完成今日任务
- 首页显示今日任务
- 点击"完成"按钮标记任务
- 查看进度条和连续天数

### 3. 查看成长进度
- 点击"成长进度"
- 查看统计数据
- 解锁成就徽章

## 🔧 常用命令

\`\`\`bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start

# 代码检查
npm run lint
\`\`\`

## 📱 页面导航

- `/` - 着陆页
- `/login` - 登录页
- `/signup` - 注册页
- `/dashboard` - 今日任务（首页）
- `/dashboard/goals` - 目标管理
- `/dashboard/progress` - 成长进度

## 🐛 常见问题

### 1. 端口被占用
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\`\`\`

### 2. Firebase配置错误
- 检查`.env.local`文件
- 确认Firebase项目已启用所需服务
- 查看浏览器控制台错误信息

### 3. 无法登录/注册
- 确认Firebase Authentication已启用
- 检查邮箱是否已注册
- 查看Firebase Console中的Users列表

## 🚀 下一步

- 阅读 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) 了解详细配置
- 查看 [README.md](./README.md) 了解项目结构
- 开始使用应用并创建你的第一个目标！

## 💡 提示

- 每日首次登录会自动生成任务
- AI引导会根据你的任务类型智能匹配
- 连续完成任务会解锁成就徽章
- 可以随时暂停或激活目标

祝你使用愉快！🎉

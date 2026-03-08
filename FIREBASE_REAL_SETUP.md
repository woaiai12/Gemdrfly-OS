# 🔥 配置真实Firebase - 完整指南

## 📋 配置清单

- [ ] 创建Firebase项目
- [ ] 启用Authentication（Email + Google）
- [ ] 创建Firestore Database
- [ ] 获取Firebase配置信息
- [ ] 更新.env.local文件
- [ ] 测试连接

---

## 🚀 详细步骤

### 步骤1：创建Firebase项目

1. 访问 https://console.firebase.google.com/
2. 点击"添加项目"
3. 输入项目名称：`gemdrfly-os`
4. 暂时不启用Google Analytics
5. 点击"创建项目"

### 步骤2：启用Authentication

1. 在Firebase控制台，点击左侧菜单的"Authentication"
2. 点击"开始使用"
3. 点击"添加登录方法"
4. 启用以下登录提供商：

#### A. Email/Password
- 找到"电子邮件/密码"
- 点击，选择"启用"
- 点击"保存"

#### B. Google
- 找到"Google"
- 点击，选择"启用"
- 输入项目公开名称：`Gemdrfly OS`
- 输入支持邮箱
- 点击"保存"

### 步骤3：创建Firestore Database

1. 点击左侧菜单的"Firestore Database"
2. 点击"创建数据库"
3. 选择位置（选择离你最近的区域）
4. **选择测试模式**（推荐用于开发）
5. 点击"启用"

### 步骤4：获取Firebase配置

1. 点击项目设置（齿轮图标）
2. 选择"常规"标签
3. 滚动到"您的应用"部分
4. 点击网页图标 `</>`
5. 输入应用名称：`gemdrfly-os`
6. **不要勾选**"为此应用设置Firebase Hosting"
7. 点击"注册应用"
8. **复制配置代码**

你会得到类似这样的配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 步骤5：更新.env.local文件

**重要：将上面复制的配置值更新到`.env.local`文件**

```env
# 用你真实的配置替换这些值
NEXT_PUBLIC_FIREBASE_API_KEY=你的API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=你的APP_ID

# 关闭演示模式
NEXT_PUBLIC_DEMO_MODE=false
```

### 步骤6：重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤7：测试真实Firebase

1. 打开浏览器访问 http://localhost:3000
2. 点击"立即注册"
3. 输入真实的邮箱和密码
4. 注册成功后会自动创建Firebase用户

---

## ✅ 验证配置

### 检查Authentication

1. 在Firebase控制台，进入"Authentication"
2. 点击"Users"标签
3. 你应该能看到新注册的用户

### 检查Firestore

1. 在Firebase控制台，进入"Firestore Database"
2. 点击"数据"标签
3. 你应该能看到"users"集合
4. 展开后应该能看到用户文档

---

## 🔧 故障排除

### 问题1：Firebase: Error (auth/api-key-not-found)

**原因**：API Key配置错误

**解决**：
1. 重新从Firebase控制台复制配置
2. 确保没有多余的空格
3. 确保所有环境变量都已设置

### 问题2：Firebase: Error (auth/email-already-in-use)

**原因**：邮箱已被注册

**解决**：
1. 使用不同的邮箱注册
2. 或在Authentication中删除现有用户

### 问题3：Missing or insufficient permissions

**原因**：Firestore安全规则限制

**解决**：
1. 确保Firestore已启用
2. 检查安全规则配置
3. 开发阶段可以使用测试模式

### 问题4：无法连接到Firebase

**原因**：网络或配置问题

**解决**：
1. 检查网络连接
2. 确保使用的是正确的projectId
3. 清除浏览器缓存
4. 检查浏览器控制台的错误信息

---

## 📊 数据结构说明

配置成功后，Firestore会自动创建以下集合：

### users集合
```javascript
{
  uid: string,
  email: string,
  createdAt: Timestamp
}
```

### goals集合
```javascript
{
  userId: string,
  title: string,
  dailyTime: number,
  category: string,
  status: 'active' | 'paused' | 'completed',
  createdAt: Timestamp
}
```

### tasks集合
```javascript
{
  goalId: string,
  userId: string,
  date: Timestamp,
  content: string,
  duration: number,
  completed: boolean,
  completedAt: Timestamp (可选)
}
```

### completions集合
```javascript
{
  userId: string,
  taskId: string,
  goalId: string,
  completedAt: Timestamp
}
```

---

## 🔒 生产环境安全规则

当准备部署到生产环境时，使用以下Firestore规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户只能访问自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 目标数据
    match /goals/{goalId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // 任务数据
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // 完成记录
    match /completions/{completionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🎯 下一步

配置完成后：
1. ✅ 测试注册功能
2. ✅ 测试登录功能
3. ✅ 创建第一个目标
4. ✅ 完成第一个任务
5. ✅ 查看成长进度

祝你配置顺利！🚀

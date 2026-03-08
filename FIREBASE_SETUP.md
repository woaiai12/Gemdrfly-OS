# Firebase配置指南

本指南将帮助你配置Gemdrfly OS所需的Firebase服务。

## 步骤1: 创建Firebase项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称（例如：gemdrfly-os）
4. 选择是否启用Google Analytics（MVP阶段可以选择不启用）
5. 点击"创建项目"

## 步骤2: 配置Authentication

1. 在左侧菜单中，点击"Authentication"
2. 点击"开始使用"
3. 点击"添加登录方法"
4. 启用以下登录提供商：

### Email/Password
- 点击"Email/Password"
- 选择"启用"
- 点击"保存"

### Google
- 点击"Google"
- 选择"启用"
- 输入项目公开名称和支持邮箱
- 点击"保存"

## 步骤3: 创建Firestore Database

1. 在左侧菜单中，点击"Firestore Database"
2. 点击"创建数据库"
3. 选择位置（建议选择离用户最近的位置）
4. 选择安全规则：

### 测试模式（开发阶段推荐）
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 1);
    }
  }
}
\`\`\`

### 生产模式（部署时使用）
复制以下安全规则：

\`\`\`javascript
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
\`\`\`

5. 点击"启用"

## 步骤4: 获取Firebase配置

1. 点击项目设置图标（齿轮图标）
2. 选择"常规"标签
3. 滚动到"您的应用"部分
4. 点击网页图标（</>）
5. 输入应用名称（例如：gemdrfly-os）
6. **不勾选**"为此应用设置Firebase Hosting"
7. 点击"注册应用"
8. 复制配置信息

## 步骤5: 更新环境变量

在项目根目录创建 `.env.local` 文件，粘贴你复制的配置：

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gemdrfly-os.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gemdrfly-os
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gemdrfly-os.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
\`\`\`

## 步骤6: 验证配置

1. 启动开发服务器：
   \`\`\`bash
   npm run dev
   \`\`\`

2. 访问 http://localhost:3000

3. 测试注册功能：
   - 点击"立即注册"
   - 输入邮箱和密码
   - 提交注册

4. 检查Firebase Console：
   - Authentication → Users → 应该能看到新用户
   - Firestore Database → users → 应该能看到新用户文档

## 常见问题

### 问题1: "Firebase: Error (auth/configuration-not-found)"
**原因**: 环境变量配置错误
**解决**: 检查 `.env.local` 文件中的配置是否正确

### 问题2: "Firebase: Error (auth/email-already-in-use)"
**原因**: 邮箱已被注册
**解决**: 使用不同的邮箱或在Authentication中删除现有用户

### 问题3: "Missing or insufficient permissions"
**原因**: Firestore安全规则限制
**解决**: 检查Firestore安全规则配置

### 问题4: Google登录失败
**原因**: Google OAuth未正确配置
**解决**:
1. 确保在Authentication中启用了Google登录
2. 检查OAuth同意屏幕配置
3. 确保在Google Cloud Console中启用了相应的API

## 数据库索引

某些复杂查询可能需要创建索引。如果遇到错误提示，Firebase会提供索引创建链接，点击即可自动创建。

## 下一步

配置完成后，你可以：
1. 开始使用应用
2. 创建目标
3. 完成每日任务
4. 查看成长进度

祝你使用愉快！🚀

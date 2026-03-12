# PWA 功能说明

## 📱 PWA (Progressive Web App) 功能已启用

Gemdrfly OS 现在支持作为 PWA 安装到您的设备上！

### ✨ 功能特性

#### 1. 离线访问
- ✅ 应用可以离线运行
- ✅ 首次访问后，缓存资源
- ✅ 后台自动更新缓存

#### 2. 桌面安装
- ✅ 可以安装到桌面
- ✅ 独立窗口运行（类似原生应用）
- ✅ 显示在应用列表中

#### 3. 快捷方式
- ✅ "今日任务" 快捷方式
- ✅ "我的目标" 快捷方式

#### 4. 推送通知
- ✅ 支持浏览器通知
- ✅ 任务完成提醒
- ✅ 重要事件通知

### 🚀 安装方法

#### 桌端浏览器（Chrome/Edge）
1. 访问应用
2. 点击地址栏右侧的安装图标（或使用右下角的"安装到桌面"按钮）
3. 点击"安装"
4. 应用将添加到桌面和应用列表

#### 移动端浏览器（Chrome/Safari）
1. 访问应用
2. 点击浏览器菜单（"..."或"分享"）
3. 选择"添加到主屏幕"或"安装应用"
4. 应用将添加到主屏幕

### 📋 技术实现

```
- next-pwa: PWA 支持插件
- Service Worker: 离线缓存
- Web App Manifest: 应用元数据
- Cache Strategy: 网络优先，离线回退
```

### 🔧 配置文件

- **manifest.json**: 应用配置
- **next.config.mjs**: PWA 插件配置
- **PWAInstallPrompt.tsx**: 安装提示组件

### ⚠️ 注意事项

1. **开发环境**: PWA 在开发环境默认禁用，生产环境自动启用
2. **HTTPS**: PWA 需要 HTTPS 支持（localhost 除外）
3. **浏览器支持**: Chrome、Edge、Firefox、Safari（部分功能）

### 📱 测试 PWA

1. 访问 http://localhost:3001
2. 打开开发者工具 → Application
3. 查看 Service Workers 和 Manifest
4. 测试离线功能（勾选 "Offline"）

---

**安装后享受更流畅的体验！** 🎉

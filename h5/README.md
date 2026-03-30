# 🦜 鹦鹉成长日记 - H5 版本使用指南

> 无需 APK，打开浏览器就能用！

---

## 📱 什么是 H5 版本？

H5 版本是一个**移动端网页应用**，具有以下特点：

| 特点 | 说明 |
|------|------|
| ✅ 无需安装 | 打开浏览器就能用 |
| ✅ 跨平台 | iOS/Android 都能用 |
| ✅ 可添加到主屏幕 | 像 APP 一样方便 |
| ✅ 自动更新 | 无需手动升级 |
| ✅ 离线可用 | 支持 PWA 离线访问 |

---

## 🚀 立即使用（3 种方式）

### 方式 1：本地预览（开发测试）

```bash
# 进入 H5 目录
cd /home/admin/openclaw/workspace/parrot-diary/h5

# 启动本地服务器
python3 -m http.server 8080

# 浏览器访问
http://localhost:8080
```

### 方式 2：部署到 Vercel（推荐，免费）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
cd /home/admin/openclaw/workspace/parrot-diary/h5
vercel --prod
```

**部署成功后会获得一个链接：**
```
https://parrot-diary.vercel.app
```

### 方式 3：部署到阿里云 OSS（国内访问快）

```bash
# 1. 登录阿里云 OSS 控制台
# 2. 创建 Bucket
# 3. 上传 h5 目录所有文件
# 4. 设置静态页面托管
```

---

## 📱 添加到手机主屏幕

### iOS (Safari)

1. 用 Safari 打开链接
2. 点击底部「分享」按钮
3. 选择「添加到主屏幕」
4. 点击「添加」

### Android (Chrome)

1. 用 Chrome 打开链接
2. 点击右上角「⋮」菜单
3. 选择「添加到主屏幕」
4. 点击「添加」

**添加后，桌面会出现 APP 图标，点击直接打开！**

---

## 🎯 H5 功能预览

### 首页
- 🦜 鹦鹉信息卡片
- ⚡ 快捷功能入口
- 📅 今日提醒
- 📸 最近照片

### 底部导航
| 图标 | 功能 |
|------|------|
| 🏠 | 首页 |
| 📷 | 相册 |
| 📖 | 饲养指南 |
| 🎵 | 音频训练 |
| 📝 | 日记 |

### 核心功能
- ✅ 照片相册（时间轴展示）
- ✅ 饲养指南（18 篇文章）
- ✅ 音频训练（80 首预置音频）
- ✅ 鹦鹉日记（心情标签）
- ✅ 提醒功能（喂食、换水等）

---

## 🌐 访问链接

### 开发环境
```
http://localhost:8080
```

### 生产环境（部署后）
```
https://parrot-diary.vercel.app
```

### 手机扫码访问
```
用手机浏览器扫描二维码即可访问
```

---

## 📊 对比 APK 版本

| 特性 | H5 版本 | APK 版本 |
|------|--------|---------|
| 安装方式 | 浏览器访问 | 下载安装包 |
| 大小 | ~50KB | ~50MB |
| 更新 | 自动 | 手动 |
| 跨平台 | ✅ 是 | ❌ 仅 Android |
| 离线使用 | ⚠️ 部分 | ✅ 完全 |
| 推送通知 | ❌ 不支持 | ✅ 支持 |
| 相机访问 | ✅ 支持 | ✅ 支持 |
| 文件上传 | ✅ 支持 | ✅ 支持 |

---

## 🛠️ 自定义配置

### 修改主题色

编辑 `index.html`，找到：
```css
.header {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}
```

修改颜色值即可。

### 修改鹦鹉信息

编辑 `index.html`，找到：
```html
<div class="parrot-name">小灰</div>
<div class="parrot-detail">玄凤鹦鹉 | 1 岁 3 个月</div>
```

修改成你的鹦鹉信息。

### 添加更多功能

H5 版本是纯前端代码，可以直接编辑 `index.html` 添加功能。

---

## 📞 常见问题

### Q1: 为什么添加到主屏幕后还是浏览器？
**A**: 确保配置了 `manifest.json` 和 Service Worker，并且使用 HTTPS。

### Q2: 数据会丢失吗？
**A**: H5 版本使用本地存储（LocalStorage），清除浏览器缓存会丢失数据。

### Q3: 可以离线使用吗？
**A**: 可以，首次访问后 Service Worker 会缓存页面，之后可以离线访问。

### Q4: 如何分享给朋友？
**A**: 直接发送链接即可，朋友用浏览器打开就能用。

---

## 🎯 推荐使用方式

### 个人使用
```
部署到 Vercel → 添加到主屏幕 → 日常使用
```

### 分享给朋友
```
发送链接 → 朋友打开 → 添加到主屏幕
```

### 公众号引流
```
公众号菜单 → H5 链接 → 用户访问 → 添加到主屏幕
```

---

## 📄 文件说明

```
h5/
├── index.html          # 主页面
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
└── README.md          # 使用说明
```

---

## 🚀 快速部署到 Vercel

```bash
# 1. 安装 Vercel
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /home/admin/openclaw/workspace/parrot-diary/h5
vercel --prod

# 4. 获取链接
# https://parrot-diary-xxx.vercel.app
```

---

**现在你可以直接用浏览器访问 H5 版本，无需 APK！** 🎉

访问链接：`http://localhost:8080` 或部署后的在线链接

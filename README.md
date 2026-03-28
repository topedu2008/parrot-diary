# 🦜 鹦鹉成长日记 - 微信小程序

> 记录鹦鹉成长的点点滴滴，让每一刻都珍贵

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/parrot-diary)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/yourusername/parrot-diary)
[![WeChat](https://img.shields.io/badge/平台 - 微信小程序-07c160.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 📱 产品介绍

鹦鹉成长日记是一款专为鹦鹉主人设计的记录工具，帮助你：

- 📷 **记录成长** - 上传照片和视频，记录鹦鹉的每一个精彩瞬间
- 🎵 **音频训练** - 提供专业训练音频，记录训练进步过程
- 📖 **饲养指南** - 专业的饲养知识，帮助你科学养鹦鹉
- 📝 **鹦鹉日记** - 写下与鹦鹉的日常，留下美好回忆

---

## 🎯 核心功能

| 模块 | 功能 | 状态 |
|------|------|------|
| 🏠 首页 | 鹦鹉信息、快捷功能、今日提醒 | ✅ 规划中 |
| 📷 鹦鹉相册 | 照片/视频上传、时间轴展示 | ✅ 规划中 |
| 📖 饲养指南 | 饮食/环境/健康/行为四大类 | ✅ 规划中 |
| 🎵 音频训练 | 预置音频、录音训练、成就系统 | ✅ 规划中 |
| 📝 鹦鹉日记 | 写日记、心情标签、照片记录 | ✅ 规划中 |
| 👤 我的 | 鹦鹉管理、数据统计、设置 | ✅ 规划中 |

---

## 🛠️ 技术架构

### 当前版本：v1.0（纯本地存储）

```
┌─────────────────────────────────┐
│       微信小程序                 │
├─────────────────────────────────┤
│  本地缓存 (wx.setStorage)       │
│  文件系统 (wx.getFileSystem)    │
│  静态数据 (JSON 文件)            │
└─────────────────────────────────┘
```

**特点**：
- ✅ 零成本 - 不需要服务器和数据库
- ✅ 开发快 - 纯前端开发
- ✅ 隐私好 - 数据存储在用户手机
- ✅ 离线可用 - 不需要网络

### 未来升级路线

| 版本 | 架构 | 预计时间 |
|------|------|---------|
| v1.0 | 纯本地存储 | 当前版本 |
| v1.5 | 本地 + 微信云开发 | 用户>1000 时 |
| v2.0 | 完整后端 + 云存储 | 用户>10000 时 |

---

## 📦 项目结构

```
parrot-diary/
├── README.md                 # 项目说明
├── docs/                     # 产品文档
│   ├── 饲养指南素材.md
│   ├── 音频训练素材.md
│   ├── 预置音频清单完整版.md
│   └── 小程序页面原型设计.md
├── miniprogram/              # 小程序代码
│   ├── pages/                # 页面
│   │   ├── index/            # 首页
│   │   ├── album/            # 相册
│   │   ├── guide/            # 饲养指南
│   │   ├── training/         # 音频训练
│   │   ├── diary/            # 日记
│   │   └── profile/          # 我的
│   ├── components/           # 公共组件
│   ├── utils/                # 工具类
│   │   ├── storage.js        # 本地存储封装
│   │   ├── file.js           # 文件管理
│   │   └── image.js          # 图片处理
│   ├── data/                 # 静态数据
│   │   ├── guides.json       # 饲养指南
│   │   └── audios.json       # 音频列表
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片
│   │   └── audios/           # 音频文件
│   ├── app.js                # 小程序入口
│   ├── app.json              # 小程序配置
│   ├── app.wxss              # 全局样式
│   └── sitemap.json          # 索引配置
├── .gitignore                # Git 忽略文件
└── project.config.json       # 项目配置
```

---

## 🚀 快速开始

### 环境要求

- 微信开发者工具（最新版）
- 小程序账号（用于真机测试）

### 开发步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/parrot-diary.git
   cd parrot-diary
   ```

2. **导入项目**
   - 打开微信开发者工具
   - 导入项目，选择 `miniprogram/` 目录
   - 填写你的 AppID（测试可选测试号）

3. **安装依赖**
   ```bash
   # 本项目无外部依赖，直接使用
   ```

4. **运行项目**
   - 点击编译按钮
   - 在模拟器中预览

5. **真机测试**
   - 点击"预览"按钮
   - 用微信扫码在手机上测试

---

## 📖 开发文档

### 本地存储使用

```javascript
import storage from '../../utils/storage';

// 添加鹦鹉
const parrot = storage.addParrot({
  name: '小灰',
  breed: '玄凤鹦鹉',
  birthday: '2025-01-15',
  gender: 'female'
});

// 添加照片
storage.addPhoto(parrotId, {
  type: 'photo',
  path: filePath,
  caption: '学唱歌',
  tags: ['第一次', '成长']
});

// 获取照片列表
const photos = storage.getParrotPhotos(parrotId);
```

### 添加新页面

1. 在 `pages/` 目录创建页面文件夹
2. 在 `app.json` 中注册页面
3. 创建页面文件（.js, .wxml, .wxss, .json）

---

## 📊 数据统计

### 存储限制

| 类型 | 限制 | 说明 |
|------|------|------|
| 本地缓存 | 10MB | 文本数据 |
| 文件系统 | 200MB | 图片、视频、音频 |
| 单次写入 | 1MB | 限制 |

### 优化建议

- 图片自动压缩到 500KB 以内
- 视频限制 5 秒，自动压缩
- 定期清理缓存

---

## 🤝 贡献指南

欢迎贡献代码、提交 Issue 或 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.0.0 (2026-03-28)
- 🎉 项目初始化
- 📱 完成产品原型设计
- 📦 完成饲养指南素材整理
- 🎵 完成音频训练素材整理

---

## 📄 开源协议

MIT License

---

## 👤 开发者

- **开发者**: 用户 EF5F
- **公众号**: （待补充，3 万用户）
- **联系邮箱**: （待补充）

---

## 🙏 致谢

感谢所有支持和使用鹦鹉成长日记的用户！

---

## 📞 联系方式

- 微信公众号：（待补充）
- 项目 Issues: https://github.com/yourusername/parrot-diary/issues

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

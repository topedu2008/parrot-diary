# 🦜 鹦鹉成长日记 - Android APP 构建指南

> 使用 Capacitor 将 Web 应用打包成 Android APK

---

## ✅ 已完成配置

- [x] Capacitor 核心安装
- [x] Android 平台添加
- [x] 项目配置完成
- [x] 构建脚本配置

---

## 📋 构建步骤

### 方式一：使用命令行（推荐）⭐

#### 1. 同步代码到 Android

```bash
cd /home/admin/openclaw/workspace/parrot-diary
npm run android:build
```

#### 2. 打开 Android Studio

```bash
npm run android:open
```

#### 3. 在 Android Studio 中构建

```
1. 等待 Gradle 同步完成
2. Build → Build Bundle(s) / APK(s)
3. Build APK(s)
4. 等待编译完成
```

#### 4. 获取 APK 文件

```
位置：android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 方式二：直接生成 APK

```bash
cd /home/admin/openclaw/workspace/parrot-diary/android

# 使用 Gradle 构建
./gradlew assembleDebug

# APK 位置
ls -lh app/build/outputs/apk/debug/
```

---

## 📱 安装到手机

### 方式一：USB 调试

1. **手机开启开发者模式**
   - 设置 → 关于手机 → 连续点击"版本号"7 次
   - 设置 → 开发者选项 → 开启"USB 调试"

2. **连接电脑**
   ```bash
   adb devices  # 检查设备连接
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 方式二：直接传输 APK

1. **复制 APK 到手机**
   - 通过微信、QQ、蓝牙等方式
   - 将 APK 文件发送到手机

2. **在手机上安装**
   - 打开文件管理器
   - 找到 APK 文件
   - 点击安装

---

## 🎨 APP 图标和启动屏

### 当前配置

- **APP 名称**: 鹦鹉成长日记
- **包名**: com.parrot.diary
- **启动屏背景**: 绿色 (#4CAF50)
- **APP 图标**: 需要添加

### 添加 APP 图标

**需要准备以下尺寸的图标**：

| 目录 | 尺寸 | 用途 |
|------|------|------|
| mipmap-mdpi | 48x48 | 低密度屏 |
| mipmap-hdpi | 72x72 | 中密度屏 |
| mipmap-xhdpi | 96x96 | 高密度屏 |
| mipmap-xxhdpi | 144x144 | 超高密度屏 |
| mipmap-xxxhdpi | 192x192 | 超超高密度屏 |

**图标文件**：
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png
android/app/src/main/res/mipmap-hdpi/ic_launcher.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

---

## ⚙️ 配置权限

### 当前权限

编辑：`android/app/src/main/AndroidManifest.xml`

**已配置权限**：
- ✅ 网络访问
- ✅ 存储读写

**需要添加的权限**（如果需要）：
```xml
<!-- 相机 -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- 录音 -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />

<!-- 相册 -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 🔧 常见问题

### Q1: Gradle 同步失败

**解决**：
```bash
# 清理缓存
cd android
./gradlew clean

# 重新同步
npx cap sync android
```

### Q2: 找不到 Android SDK

**解决**：
1. 安装 Android Studio
2. 设置 ANDROID_HOME 环境变量
3. 重启终端

### Q3: 构建时间过长

**解决**：
- 第一次构建需要下载依赖（10-30 分钟）
- 后续构建会快很多（1-3 分钟）
- 使用 SSD 硬盘会更快

### Q4: APK 文件太大

**解决**：
```bash
# 构建 Release 版本（更小更快）
./gradlew assembleRelease

# 启用 ProGuard 代码压缩
# 编辑 android/app/build.gradle
```

---

## 📊 构建时间

| 步骤 | 首次 | 后续 |
|------|------|------|
| Gradle 同步 | 5-10 分钟 | 1-2 分钟 |
| 编译 APK | 10-20 分钟 | 2-5 分钟 |
| **总计** | **15-30 分钟** | **3-7 分钟** |

---

## 🎯 下一步

### 立即行动

1. **打开 Android Studio**
   ```bash
   npm run android:open
   ```

2. **等待 Gradle 同步**

3. **构建 APK**
   - Build → Build APK(s)

4. **测试安装**
   - 发送到手机安装测试

### 后续优化

- [ ] 添加 APP 图标（多尺寸）
- [ ] 配置启动屏图片
- [ ] 添加权限配置
- [ ] 构建 Release 版本
- [ ] 签名打包

---

## 📞 获取帮助

- **Capacitor 文档**: https://capacitorjs.com/docs
- **Android 开发**: https://developer.android.com/
- **项目 Issues**: https://github.com/topedu2008/parrot-diary/issues

---

**构建完成后，你就有了自己的 Android APP！** 🎉

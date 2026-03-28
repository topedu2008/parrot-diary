# 🦜 鹦鹉成长日记 - APK 构建方案

> 由于当前服务器没有 Java 17 环境，提供以下三种构建方案

---

## 📋 当前状态

- ✅ 项目代码已完成
- ✅ Capacitor 已配置
- ✅ Android 项目已同步
- ⚠️ 需要 Java 17 环境来构建 APK

---

## ✅ 方案一：本地构建（推荐，如果你有电脑）

### 在本地电脑上构建（Windows/Mac/Linux）

**步骤 1：克隆项目**
```bash
git clone https://github.com/topedu2008/parrot-diary.git
cd parrot-diary
```

**步骤 2：安装依赖**
```bash
npm install
```

**步骤 3：同步 Capacitor**
```bash
npx cap sync android
```

**步骤 4：用 Android Studio 打开**
```bash
npx cap open android
```

**步骤 5：在 Android Studio 中构建**
1. Android Studio 会自动打开项目
2. 点击 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. 等待构建完成
4. APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 环境要求

| 软件 | 版本 | 下载地址 |
|------|------|---------|
| Node.js | 16+ | https://nodejs.org |
| Android Studio | 最新版 | https://developer.android.com |
| Java JDK | 17+ | https://adoptium.net |

---

## ✅ 方案二：使用 GitHub Actions 自动构建（推荐，无需本地环境）

### 已配置 GitHub Actions

项目已经包含了 GitHub Actions 工作流文件，可以自动构建 APK。

**步骤 1：推送到 GitHub**
```bash
cd /home/admin/openclaw/workspace/parrot-diary
git add .
git commit -m "准备 APK 构建"
git push origin main
```

**步骤 2：在 GitHub 上查看构建**
1. 访问 https://github.com/topedu2008/parrot-diary/actions
2. 找到最新的构建工作流
3. 等待构建完成（约 10-15 分钟）
4. 在 Artifacts 中下载 APK 文件

### 手动触发构建

1. 访问 https://github.com/topedu2008/parrot-diary/actions/workflows/build-apk.yml
2. 点击 "Run workflow"
3. 选择分支（main）
4. 点击 "Run workflow"
5. 等待完成后下载 APK

---

## ✅ 方案三：使用在线构建服务

### 使用 Expo Application Services (EAS)

虽然我们是 Capacitor 项目，但可以使用类似的在线构建服务：

**1. Appetize.io（测试用）**
- 网址：https://appetize.io
- 上传 Web 版本进行在线测试
- 适合快速预览

**2. BrowserStack App Live**
- 网址：https://www.browserstack.com/app-live
- 在真实设备上测试
- 需要付费

---

## ✅ 方案四：在服务器上安装 Java 17（如果你有 sudo 权限）

### 安装 Java 17

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y openjdk-17-jdk

# 验证安装
java -version

# 设置 JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# 永久设置（添加到 ~/.bashrc）
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 然后构建 APK

```bash
cd /home/admin/openclaw/workspace/parrot-diary/android
./gradlew assembleDebug --no-daemon
```

APK 输出位置：
```
/home/admin/openclaw/workspace/parrot-diary/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 快速测试方案（无需 APK）

### 使用 Web 版本

项目已经包含 Web 版本，可以直接在浏览器中测试：

**1. 本地预览**
```bash
cd /home/admin/openclaw/workspace/parrot-diary
npx http-server web -p 8080
```

然后访问：http://localhost:8080

**2. 在线预览（已部署）**
- Vercel 部署：https://parrot-diary.vercel.app
- 可以在手机上直接访问测试

---

## 🎯 推荐流程

### 如果你有电脑（Windows/Mac/Linux）

```
本地电脑 → 安装 Android Studio → 打开项目 → 构建 APK（15 分钟）
```

### 如果你没有电脑

```
推送代码到 GitHub → 使用 GitHub Actions → 自动构建 APK（15 分钟）
```

### 如果你只是想快速测试

```
直接访问 Web 版本 → 手机浏览器打开 → 添加到主屏幕
```

---

## 📦 APK 文件说明

构建成功后会生成两个 APK：

| 文件 | 大小 | 用途 |
|------|------|------|
| `app-debug.apk` | ~50MB | 开发测试版（推荐） |
| `app-release.apk` | ~30MB | 正式发布版（需签名） |

**调试版特点**：
- ✅ 无需签名
- ✅ 可直接安装
- ✅ 包含调试信息
- ❌ 体积较大
- ❌ 不能上架应用商店

---

## 🔧 常见问题

### Q1: 构建失败，提示 Java 版本不对
**A**: 确保安装了 Java 17，并设置 JAVA_HOME

### Q2: Gradle 下载很慢
**A**: 使用国内镜像，修改 `android/build.gradle`：
```gradle
repositories {
    google()
    mavenCentral()
    maven { url 'https://maven.aliyun.com/repository/google' }
    maven { url 'https://maven.aliyun.com/repository/public' }
}
```

### Q3: APK 安装失败
**A**: 确保手机开启了"允许安装未知来源应用"

### Q4: 白屏或无法加载
**A**: 检查 `capacitor.config.json` 中的 `webDir` 配置，确保 web 目录存在

---

## 📞 需要帮助？

如果遇到其他问题，可以：

1. 查看 GitHub Issues: https://github.com/topedu2008/parrot-diary/issues
2. 查看 Android Studio 构建日志
3. 检查 Gradle 错误信息

---

**祝你构建顺利！🎉**

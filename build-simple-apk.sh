#!/bin/bash
# 简化的 APK 构建脚本 - 使用 Web 技术栈

echo "🦜 鹦鹉成长日记 - 简化构建"
echo "================================"

# 检查环境
echo "检查环境..."
node -v
npm -v

# 同步 Capacitor
echo "同步 Capacitor..."
npx cap sync android

# 尝试使用 Gradle 包装器构建
echo "构建 APK..."
cd android
./gradlew assembleDebug --no-daemon

# 检查输出
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo "APK 位置：$(pwd)/app/build/outputs/apk/debug/app-debug.apk"
    ls -lh app/build/outputs/apk/debug/app-debug.apk
else
    echo "❌ 构建失败或 APK 未生成"
fi

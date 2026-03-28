#!/bin/bash

# ===========================================
# 鹦鹉成长日记 - Android APK 构建脚本
# 适用于 Ubuntu 系统
# ===========================================

set -e  # 遇到错误立即退出

echo "🦜 鹦鹉成长日记 - APK 构建脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否已安装 Java
check_java() {
    print_info "检查 Java 环境..."
    if ! command -v java &> /dev/null; then
        print_error "Java 未安装，请先安装 Java 17"
        echo "sudo apt update && sudo apt install -y openjdk-17-jdk"
        exit 1
    fi
    java -version
    print_info "Java 已安装 ✓"
}

# 检查是否已安装 Node.js
check_node() {
    print_info "检查 Node.js 环境..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        exit 1
    fi
    node -v
    npm -v
    print_info "Node.js 已安装 ✓"
}

# 检查磁盘空间
check_disk() {
    print_info "检查磁盘空间..."
    available=$(df -h / | tail -1 | awk '{print $4}')
    echo "可用空间：$available"
    print_info "磁盘空间检查完成 ✓"
}

# 安装 Android SDK
install_android_sdk() {
    print_info "开始安装 Android SDK..."
    
    # 创建 SDK 目录
    SDK_DIR=~/android-sdk
    mkdir -p $SDK_DIR
    cd $SDK_DIR
    
    # 检查是否已安装
    if [ -f "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]; then
        print_info "Android SDK 已安装，跳过下载"
    else
        print_info "下载 Android 命令行工具..."
        wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip
        
        print_info "解压..."
        unzip -q cmdline-tools.zip
        mkdir -p cmdline-tools/latest
        mv cmdline-tools/bin cmdline-tools/lib cmdline-tools/NOTICE.txt cmdline-tools/source.properties cmdline-tools/latest/ 2>/dev/null || true
        rm cmdline-tools.zip
    fi
    
    # 设置环境变量
    export ANDROID_HOME=$SDK_DIR
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    
    print_info "接受许可证..."
    yes | sdkmanager --licenses > /dev/null 2>&1 || true
    
    print_info "安装 Android SDK 组件..."
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2" > /dev/null 2>&1 || print_warn "SDK 组件可能已安装"
    
    print_info "Android SDK 安装完成 ✓"
}

# 克隆项目
clone_project() {
    print_info "克隆项目..."
    
    cd ~
    if [ -d "parrot-diary" ]; then
        print_info "项目已存在，进入目录..."
        cd parrot-diary
        git pull
    else
        git clone https://github.com/topedu2008/parrot-diary.git
        cd parrot-diary
    fi
    
    print_info "项目准备完成 ✓"
}

# 安装 Node 依赖
install_deps() {
    print_info "安装 Node.js 依赖..."
    npm install
    print_info "依赖安装完成 ✓"
}

# 同步 Capacitor
sync_capacitor() {
    print_info "同步 Capacitor..."
    npx cap sync android
    print_info "Capacitor 同步完成 ✓"
}

# 构建 APK
build_apk() {
    print_info "开始构建 APK..."
    
    cd android
    
    # 设置 Gradle 可执行
    chmod +x gradlew
    
    # 构建
    ./gradlew assembleDebug --no-daemon
    
    print_info "APK 构建完成 ✓"
}

# 显示 APK 位置
show_apk() {
    print_info "================================"
    print_info "🎉 构建成功！"
    print_info "================================"
    
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        print_info "APK 文件位置："
        ls -lh $APK_PATH
        echo ""
        print_info "完整路径：$(pwd)/$APK_PATH"
        echo ""
        print_info "传输到手机后，点击安装即可！"
    else
        print_error "未找到 APK 文件"
    fi
}

# 主流程
main() {
    echo ""
    check_java
    echo ""
    check_node
    echo ""
    check_disk
    echo ""
    install_android_sdk
    echo ""
    clone_project
    echo ""
    install_deps
    echo ""
    sync_capacitor
    echo ""
    build_apk
    echo ""
    show_apk
    
    print_info "================================"
    print_info "构建完成！"
    print_info "================================"
}

# 执行主流程
main

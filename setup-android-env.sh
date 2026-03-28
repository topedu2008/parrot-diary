#!/bin/bash

# ============================================
# 鹦鹉成长日记 - Android 开发环境配置脚本
# 适用于：阿里云无影云电脑（Ubuntu 系统）
# ============================================

set -e  # 遇到错误立即退出

echo "🦜 鹦鹉成长日记 - Android 开发环境配置"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# 检查是否使用 sudo
check_sudo() {
    print_info "检查 sudo 权限..."
    if ! sudo -v &>/dev/null; then
        print_error "需要 sudo 权限！请使用有 sudo 权限的账户运行此脚本"
        exit 1
    fi
    print_success "sudo 权限检查通过"
    echo ""
}

# 检查系统
check_system() {
    print_info "检查系统环境..."
    
    # 检查 Ubuntu 版本
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        print_info "操作系统：$NAME $VERSION"
        if [[ "$VERSION_ID" < "20.04" ]]; then
            print_warn "建议使用 Ubuntu 20.04 或更高版本"
        fi
    fi
    
    # 检查磁盘空间
    available=$(df -h / | tail -1 | awk '{print $4}')
    print_info "可用磁盘空间：$available"
    
    # 检查内存
    memory=$(free -h | grep Mem | awk '{print $2}')
    print_info "总内存：$memory"
    
    print_success "系统检查完成"
    echo ""
}

# 安装 Java 17
install_java() {
    print_info "安装 Java 17..."
    
    # 检查是否已安装
    if command -v java &> /dev/null; then
        current_version=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
        print_info "当前 Java 版本：$current_version"
        
        if [ "$current_version" = "17" ]; then
            print_success "Java 17 已安装，跳过"
            return 0
        fi
    fi
    
    # 更新包列表
    print_info "更新包列表..."
    sudo apt update -qq
    
    # 尝试安装 Java 17
    print_info "安装 OpenJDK 17..."
    if sudo apt install -y openjdk-17-jdk; then
        print_success "Java 17 安装成功"
        
        # 设置 JAVA_HOME
        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
        echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
        echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
        
        # 验证
        java -version
        print_success "Java 环境配置完成"
    else
        print_error "Java 17 安装失败"
        print_info "尝试使用 PPA 安装..."
        
        # 尝试 PPA 安装
        sudo add-apt-repository -y ppa:openjdk-r/ppa
        sudo apt update -qq
        sudo apt install -y openjdk-17-jdk
        
        if [ $? -eq 0 ]; then
            print_success "Java 17 通过 PPA 安装成功"
            export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
            echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
            echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
        else
            print_error "Java 17 安装失败，请手动安装"
            exit 1
        fi
    fi
    
    echo ""
}

# 安装 Android SDK
install_android_sdk() {
    print_info "安装 Android SDK..."
    
    # 设置 SDK 目录
    export ANDROID_HOME=~/android-sdk
    mkdir -p $ANDROID_HOME
    
    # 检查是否已安装
    if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
        print_success "Android SDK 已安装，跳过"
        return 0
    fi
    
    cd $ANDROID_HOME
    
    # 下载命令行工具
    print_info "下载 Android 命令行工具..."
    
    # 尝试多个下载源
    DOWNLOAD_URLS=(
        "https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip"
        "https://mirrors.tuna.tsinghua.edu.cn/android/repository/commandlinetools-linux-9477386_latest.zip"
    )
    
    for url in "${DOWNLOAD_URLS[@]}"; do
        print_info "尝试从 $url 下载..."
        if wget -q --show-progress "$url" -O cmdline-tools.zip; then
            print_success "下载成功"
            break
        fi
    done
    
    # 检查下载结果
    if [ ! -f cmdline-tools.zip ]; then
        print_error "下载失败，请检查网络连接"
        exit 1
    fi
    
    # 解压
    print_info "解压..."
    unzip -q cmdline-tools.zip
    
    # 整理目录结构
    mkdir -p cmdline-tools/latest
    mv cmdline-tools/bin cmdline-tools/lib cmdline-tools/NOTICE.txt cmdline-tools/source.properties cmdline-tools/latest/ 2>/dev/null || true
    
    # 清理
    rm cmdline-tools.zip
    
    # 设置环境变量
    echo 'export ANDROID_HOME=~/android-sdk' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
    
    # 立即生效
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    
    print_success "Android SDK 安装完成"
    echo ""
}

# 安装 SDK 组件
install_sdk_components() {
    print_info "安装 Android SDK 组件..."
    
    cd $ANDROID_HOME
    
    # 接受许可证
    print_info "接受 SDK 许可证..."
    yes | sdkmanager --licenses > /dev/null 2>&1 || print_warn "许可证接受可能已存在"
    
    # 安装组件
    print_info "安装 platform-tools..."
    sdkmanager "platform-tools"
    
    print_info "安装 Android 33 平台..."
    sdkmanager "platforms;android-33"
    
    print_info "安装 Build Tools 33.0.2..."
    sdkmanager "build-tools;33.0.2"
    
    print_success "SDK 组件安装完成"
    echo ""
}

# 安装额外工具
install_extra_tools() {
    print_info "安装额外工具..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_info "Node.js 未安装，正在安装..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
        print_success "Node.js 安装完成"
    else
        print_success "Node.js 已安装 ($(node -v))"
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        print_info "Git 未安装，正在安装..."
        sudo apt install -y git
        print_success "Git 安装完成"
    else
        print_success "Git 已安装"
    fi
    
    # 检查 unzip
    if ! command -v unzip &> /dev/null; then
        sudo apt install -y unzip
    fi
    
    # 检查 wget
    if ! command -v wget &> /dev/null; then
        sudo apt install -y wget
    fi
    
    print_success "额外工具安装完成"
    echo ""
}

# 克隆项目
clone_project() {
    print_info "克隆鹦鹉成长日记项目..."
    
    cd ~
    
    if [ -d "parrot-diary" ]; then
        print_info "项目已存在，进入目录并更新..."
        cd parrot-diary
        git pull
    else
        git clone https://github.com/topedu2008/parrot-diary.git
        cd parrot-diary
    fi
    
    print_success "项目准备完成"
    echo ""
}

# 安装项目依赖
install_project_deps() {
    print_info "安装项目 Node.js 依赖..."
    
    cd ~/parrot-diary
    
    npm install
    
    print_success "项目依赖安装完成"
    echo ""
}

# 同步 Capacitor
sync_capacitor() {
    print_info "同步 Capacitor Android 项目..."
    
    cd ~/parrot-diary
    
    npx cap sync android
    
    print_success "Capacitor 同步完成"
    echo ""
}

# 构建 APK
build_apk() {
    print_info "开始构建 APK..."
    
    cd ~/parrot-diary/android
    
    # 设置 Gradle 可执行
    chmod +x gradlew
    
    # 构建
    ./gradlew assembleDebug --no-daemon
    
    print_success "APK 构建完成"
    echo ""
}

# 显示 APK 位置
show_apk() {
    echo ""
    print_success "================================"
    print_success "🎉 恭喜！APK 构建成功！"
    print_success "================================"
    echo ""
    
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        print_info "APK 文件信息："
        ls -lh $APK_PATH
        echo ""
        print_info "完整路径："
        readlink -f $APK_PATH
        echo ""
        print_info "================================"
        print_info "📱 传输到手机安装："
        print_info "  1. 通过阿里云盘上传下载"
        print_info "  2. 通过微信文件助手"
        print_info "  3. 通过 QQ 文件传输"
        print_info "  4. 通过 USB 连接复制"
        print_info "================================"
    else
        print_error "未找到 APK 文件，请检查构建日志"
    fi
    
    echo ""
}

# 显示总结
show_summary() {
    echo ""
    print_info "================================"
    print_info "📋 配置总结"
    print_info "================================"
    echo ""
    print_info "已安装："
    print_info "  ✓ Java 17"
    print_info "  ✓ Android SDK"
    print_info "  ✓ Node.js"
    print_info "  ✓ Git"
    echo ""
    print_info "环境变量："
    print_info "  JAVA_HOME=$JAVA_HOME"
    print_info "  ANDROID_HOME=$ANDROID_HOME"
    echo ""
    print_info "项目位置：~/parrot-diary"
    print_info "APK 位置：~/parrot-diary/android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    print_info "================================"
    print_info "🚀 快速命令："
    print_info "  cd ~/parrot-diary/android"
    print_info "  ./gradlew assembleDebug"
    print_info "================================"
    echo ""
}

# 主流程
main() {
    echo ""
    check_sudo
    check_system
    install_extra_tools
    install_java
    install_android_sdk
    install_sdk_components
    clone_project
    install_project_deps
    sync_capacitor
    build_apk
    show_apk
    show_summary
    
    print_success "================================"
    print_success "配置完成！"
    print_success "================================"
    echo ""
    print_info "请重启终端或运行：source ~/.bashrc"
    echo ""
}

# 执行主流程
main

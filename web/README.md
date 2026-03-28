# 🌐 鹦鹉成长日记 - Web 版

> 静态网站版本，可直接部署到 Vercel/Netlify/GitHub Pages

---

## 🚀 快速部署

### 方式一：Vercel（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   cd web
   vercel
   ```

3. **按提示操作**
   - 第一次部署需要登录
   - 选择项目目录：`web/`
   - 选择框架：`Other`
   - 完成！

### 方式二：Netlify

1. **拖拽部署**
   - 登录 https://netlify.com
   - 将 `web/` 文件夹拖拽到部署区域
   - 完成！

2. **或 Git 部署**
   - 连接 GitHub 仓库
   - 设置发布目录：`web`
   - 自动部署！

### 方式三：GitHub Pages

1. **启用 GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 设置
   - Source 选择 `main` 分支
   - Folder 选择 `/web`
   - 保存

2. **访问地址**
   ```
   https://yourusername.github.io/parrot-diary/web/
   ```

---

## 📁 文件结构

```
web/
├── index.html        # 主页面
├── styles.css        # 样式文件
├── script.js         # 交互脚本
└── README.md         # 本文件
```

---

## 🎨 自定义

### 修改品牌信息

编辑 `index.html`：

```html
<!-- 修改标题 -->
<title>你的品牌名 - 鹦鹉成长日记</title>

<!-- 修改导航栏品牌 -->
<div class="nav-brand">🦜 你的品牌名</div>

<!-- 修改 GitHub 链接 -->
<a href="https://github.com/你的用户名/parrot-diary">
```

### 修改颜色主题

编辑 `styles.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #4CAF50;  /* 主色调 */
  --accent-color: #FF9800;   /* 辅助色 */
  /* ... 其他颜色 */
}
```

### 添加统计代码

在 `index.html` 的 `<head>` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 📊 功能说明

### 已实现

- ✅ 响应式设计（手机/平板/桌面）
- ✅ 平滑滚动动画
- ✅ Tab 切换交互
- ✅ 数据加载（饲养指南、音频列表）
- ✅ SEO 优化
- ✅ 性能优化

### 功能限制

由于是静态网站，以下功能需要在小程序中使用：

| 功能 | Web 版 | 小程序版 |
|------|-------|---------|
| 照片上传 | ❌ | ✅ |
| 录音功能 | ❌ | ✅ |
| 本地存储 | ⚠️ (localStorage) | ✅ (wx.storage) |
| 数据导出 | ❌ | ✅ |
| 离线使用 | ⚠️ (需 PWA) | ✅ |

---

## 🔧 开发

### 本地预览

```bash
# 使用 Python 快速启动服务器
cd web
python -m http.server 8080

# 或使用 Node.js
npx serve
```

访问：http://localhost:8080

### 构建优化

静态网站无需构建，直接部署即可。

如需优化：

1. **压缩图片**
   ```bash
   npm install -g imagemin-cli
   imagemin images/* --out-dir=images-optimized
   ```

2. **压缩 CSS/JS**
   ```bash
   npm install -g clean-css-cli uglify-js
   cleancss -o styles.min.css styles.css
   uglifyjs script.js -o script.min.js
   ```

---

## 📈 性能优化建议

### Lighthouse 评分目标

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 优化措施

1. **图片优化**
   - 使用 WebP 格式
   - 懒加载
   - 适当压缩

2. **代码优化**
   - 压缩 CSS/JS
   - 移除未使用代码
   - 使用 CDN

3. **缓存策略**
   - 设置 Cache-Control
   - 使用 Service Worker
   - 启用 Gzip/Brotli

---

## 🔒 隐私说明

Web 版使用浏览器的 localStorage 存储数据：

- ✅ 数据存储在用户浏览器
- ✅ 不会上传到服务器
- ✅ 清除浏览器数据会删除所有数据
- ⚠️ 不同浏览器数据不互通
- ⚠️ 清除缓存后数据丢失

**建议**：重要数据请在小程序中使用，支持导出备份。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 仓库
2. 创建分支：`git checkout -b feature/web-improvement`
3. 提交更改：`git commit -m 'Add web feature'`
4. 推送分支：`git push origin feature/web-improvement`
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [小程序版本](../miniprogram/)
- [产品文档](../docs/)
- [主项目 README](../README.md)
- [GitHub 仓库](https://github.com/yourusername/parrot-diary)

---

**Made with ❤️ for parrot lovers**

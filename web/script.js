/**
 * 鹦鹉成长日记 - Web 版
 * 静态网站交互脚本
 */

// ==================== Tab 切换 ====================
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有 active
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // 添加 active
      tab.classList.add('active');
      const panelId = tab.dataset.tab + '-panel';
      document.getElementById(panelId).classList.add('active');
    });
  });
  
  // 导航栏滚动效果
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  });
  
  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // 加载饲养指南数据
  loadGuides();
  
  // 加载音频数据
  loadAudios();
});

// ==================== 数据加载 ====================

/**
 * 加载饲养指南
 */
async function loadGuides() {
  try {
    const response = await fetch('../miniprogram/data/guides.json');
    const guides = await response.json();
    
    const guidePanel = document.getElementById('guide-panel');
    const guidePreview = guidePanel.querySelector('.guide-preview');
    
    // 显示前 5 篇
    const previewGuides = guides.slice(0, 5);
    
    guidePreview.innerHTML = previewGuides.map(guide => `
      <div class="guide-item">
        <div>
          <span class="guide-tag">${guide.category}</span>
          <span>${guide.title}</span>
        </div>
        <span style="color: var(--text-hint); font-size: 0.75rem;">${guide.readTime}分钟</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('加载饲养指南失败:', error);
  }
}

/**
 * 加载音频列表
 */
async function loadAudios() {
  try {
    const response = await fetch('../miniprogram/data/audios.json');
    const audios = await response.json();
    
    const trainingPanel = document.getElementById('training-panel');
    const audioPreview = trainingPanel.querySelector('.audio-preview');
    
    // 显示推荐的 6 首
    const previewAudios = audios
      .filter(a => a.level === '核心' || a.level === '入门')
      .slice(0, 6);
    
    audioPreview.innerHTML = previewAudios.map(audio => `
      <div class="audio-item">
        <div>
          <span style="font-size: 1.25rem; margin-right: 0.5rem;">${getAudioIcon(audio.category)}</span>
          <span>${audio.name}</span>
          <span style="color: var(--text-hint); font-size: 0.75rem; margin-left: 0.5rem;">
            ${audio.duration}秒
          </span>
        </div>
        <button class="btn-play" onclick="playAudio('${audio.audioPath}')">▶</button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('加载音频列表失败:', error);
  }
}

/**
 * 获取音频分类图标
 */
function getAudioIcon(category) {
  const icons = {
    '信号音': '🔔',
    '玄凤本能': '💬',
    '唱歌训练': '🎤',
    '技巧训练': '🧠',
    '行为训练': '🎯',
    '环境声音': '🌿'
  };
  return icons[category] || '🎵';
}

/**
 * 播放音频（示例）
 */
function playAudio(path) {
  // 实际使用时需要实现音频播放
  alert('音频播放功能需要在小程序中使用完整版本\n\n音频路径：' + path);
}

// ==================== 数据统计动画 ====================

/**
 * 数字增长动画
 */
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ==================== 表单交互 ====================

/**
 * 邮箱订阅（示例）
 */
function subscribe(email) {
  if (!email || !email.includes('@')) {
    alert('请输入有效的邮箱地址');
    return;
  }
  
  // 实际使用时需要连接到后端
  alert('感谢订阅！\n功能开发中，敬请期待～');
}

// ==================== 分享功能 ====================

/**
 * 分享到社交媒体
 */
function shareTo(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent('鹦鹉成长日记 - 记录鹦鹉成长的每一刻美好');
  
  const shareUrls = {
    weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    qq: `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`
  };
  
  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

// ==================== 工具函数 ====================

/**
 * 格式化日期
 */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 本地存储封装（Web 版）
 */
const WebStorage = {
  /**
   * 保存数据
   */
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('保存失败', e);
      return false;
    }
  },
  
  /**
   * 读取数据
   */
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('读取失败', e);
      return null;
    }
  },
  
  /**
   * 删除数据
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('删除失败', e);
      return false;
    }
  },
  
  /**
   * 清空所有数据
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('清空失败', e);
      return false;
    }
  }
};

// ==================== 性能优化 ====================

/**
 * 防抖函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== 错误处理 ====================

window.addEventListener('error', (e) => {
  console.error('发生错误:', e.error);
  // 可以在这里上报错误到监控系统
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的 Promise 拒绝:', e.reason);
  // 可以在这里上报错误到监控系统
});

// ==================== PWA 支持（可选） ====================

// 如果未来要支持 PWA，可以在这里注册 Service Worker
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js')
  //   .then(registration => {
  //     console.log('Service Worker 注册成功:', registration);
  //   })
  //   .catch(error => {
  //     console.error('Service Worker 注册失败:', error);
  //   });
}

// ==================== 控制台信息 ====================

console.log(`
🦜 鹦鹉成长日记
版本：1.0.0
作者：用户 EF5F
GitHub: https://github.com/yourusername/parrot-diary

欢迎贡献代码！⭐
`);

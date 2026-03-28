/**
 * 日记列表页面
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    currentParrot: null,
    currentMood: 'all',
    diaries: [],
    hasMore: true
  },

  onLoad() {
    this.loadParrot();
  },

  onShow() {
    this.loadDiaries();
  },

  onPullDownRefresh() {
    this.loadDiaries();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载鹦鹉信息
   */
  loadParrot() {
    const parrots = storage.getAllParrots();
    if (parrots.length > 0) {
      this.setData({ currentParrot: parrots[0] });
      this.loadDiaries();
    }
  },

  /**
   * 加载日记列表
   */
  loadDiaries() {
    if (!this.data.currentParrot) return;

    let diaries = storage.getParrotDiaries(this.data.currentParrot.id);

    // 格式化日期
    diaries = diaries.map(diary => ({
      ...diary,
      ...this.formatDate(diary.createdAt),
      mood: this.getMoodEmoji(diary.mood)
    }));

    // 筛选心情
    if (this.data.currentMood !== 'all') {
      const moodMap = {
        'happy': '😊',
        'sad': '😢',
        'sleepy': '😴',
        'excited': '🎉',
        'angry': '😤'
      };
      diaries = diaries.filter(d => d.mood === moodMap[this.data.currentMood]);
    }

    this.setData({ diaries });
  },

  /**
   * 设置心情筛选
   */
  setMood(e) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({ currentMood: mood });
    this.loadDiaries();
  },

  /**
   * 获取心情图标
   */
  getMoodEmoji(mood) {
    const moods = {
      'happy': '😊',
      'sad': '😢',
      'sleepy': '😴',
      'excited': '🎉',
      'angry': '😤',
      'love': '😍',
      'calm': '😌'
    };
    return moods[mood] || '😊';
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let dayText = '';
    if (diff < 24 * 60 * 60 * 1000) {
      dayText = '今天';
    } else if (diff < 48 * 60 * 60 * 1000) {
      dayText = '昨天';
    } else {
      dayText = `${month}月${day}日`;
    }

    return {
      day: dayText,
      weekday: weekday
    };
  },

  /**
   * 写日记
   */
  writeDiary() {
    wx.navigateTo({
      url: '/pages/diary/write/write'
    });
  },

  /**
   * 查看详情
   */
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/diary/detail/detail?id=' + id
    });
  }
});

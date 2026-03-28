/**
 * 首页
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    currentParrot: null,
    stats: {
      days: 0,
      photos: 0,
      diaries: 0,
      trainings: 0,
      weight: null
    },
    recentPhotos: [],
    latestDiary: null,
    skills: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载数据
   */
  loadData() {
    // 获取所有鹦鹉
    const parrots = storage.getAllParrots();
    
    if (parrots.length > 0) {
      // 使用第一只鹦鹉
      const parrot = parrots[0];
      this.setData({ currentParrot: parrot });
      
      // 加载各项数据
      const photos = storage.getParrotMedia(parrot.id);
      const diaries = storage.getParrotDiaries(parrot.id);
      const trainings = storage.getParrotTrainings(parrot.id);
      const days = this.calculateDays(parrot.createdAt);
      
      // 计算最新日记
      const latestDiary = diaries.length > 0 ? this.formatDiary(diaries[0]) : null;
      
      // 获取最近掌握的技能
      const skills = this.getRecentSkills(trainings);
      
      this.setData({
        stats: {
          days,
          photos: photos.length,
          diaries: diaries.length,
          trainings: trainings.length,
          weight: parrot.weight || null
        },
        recentPhotos: photos.slice(0, 4).map(p => ({
          ...p,
          date: this.formatDate(p.createdAt)
        })),
        latestDiary,
        skills
      });
    } else {
      this.setData({
        currentParrot: null,
        stats: { days: 0, photos: 0, diaries: 0, trainings: 0, weight: null },
        recentPhotos: [],
        latestDiary: null,
        skills: []
      });
    }
  },

  /**
   * 计算饲养天数
   */
  calculateDays(createdAt) {
    if (!createdAt) return 0;
    const start = new Date(createdAt);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * 格式化日记
   */
  formatDiary(diary) {
    const date = new Date(diary.createdAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return {
      ...diary,
      date: `${month}月${day}日`,
      mood: this.getMoodEmoji(diary.mood)
    };
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
   * 获取最近掌握的技能
   */
  getRecentSkills(trainings) {
    // 获取已掌握的技能（评分>=4 的）
    const mastered = trainings
      .filter(t => t.rating >= 4)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    
    return mastered.map(t => ({
      id: t.id,
      name: t.audioName || '训练技能',
      icon: this.getSkillIcon(t.audioId),
      date: this.formatDate(t.createdAt)
    }));
  },

  /**
   * 获取技能图标
   */
  getSkillIcon(audioId) {
    if (!audioId) return '🎯';
    
    const icons = {
      'SIG': '🔔',
      'SNG': '🎤',
      'SKL': '🧠',
      'BEH': '🎯',
      'NAT': '💬',
      'ENV': '🌿'
    };
    
    const prefix = audioId.substring(0, 3);
    return icons[prefix] || '🎯';
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    // 今天
    if (diff < 24 * 60 * 60 * 1000) {
      return '今天';
    }
    
    // 昨天
    if (diff < 48 * 60 * 60 * 1000) {
      return '昨天';
    }
    
    // 其他日期
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  },

  /**
   * 添加鹦鹉
   */
  addParrot() {
    wx.navigateTo({
      url: '/pages/profile/add-parrot/add-parrot'
    });
  },

  /**
   * 跳转到鹦鹉详情
   */
  goToParrot() {
    wx.navigateTo({
      url: '/pages/profile/profile?id=' + this.data.currentParrot.id
    });
  },

  /**
   * 跳转到相册
   */
  goToAlbum() {
    wx.switchTab({
      url: '/pages/album/album'
    });
  },

  /**
   * 跳转到日记
   */
  goToDiary() {
    wx.switchTab({
      url: '/pages/diary/diary'
    });
  },

  /**
   * 查看日记详情
   */
  viewDiaryDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/diary/detail/detail?id=' + id
    });
  },

  /**
   * 预览照片
   */
  previewPhoto(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.recentPhotos.map(p => p.path)
    });
  }
});

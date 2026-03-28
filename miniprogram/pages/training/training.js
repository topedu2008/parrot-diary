/**
 * 音频训练页面
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    currentCategory: 'all',
    audioList: [],
    recommended: [],
    currentAudio: null,
    isPlaying: false,
    currentTime: '00:00',
    progress: 0,
    showPlayer: false,
    hasMore: true,
    stats: {
      mastered: 0,
      learning: 0,
      total: 0
    },
    progressPercent: 0
  },

  onLoad() {
    this.loadAudios();
    this.loadTrainingStats();
  },

  onShow() {
    this.loadTrainingStats();
  },

  onUnload() {
    // 停止播放
    if (this.audioContext) {
      this.audioContext.stop();
    }
  },

  onPullDownRefresh() {
    this.loadAudios();
    this.loadTrainingStats();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载音频列表
   */
  loadAudios() {
    wx.request({
      url: '/data/audios.json',
      success: (res) => {
        let audios = res.data;
        
        // 筛选分类
        if (this.data.currentCategory !== 'all') {
          audios = audios.filter(a => a.categoryId === this.data.currentCategory);
        }

        // 推荐音频（核心和入门级别）
        const recommended = audios
          .filter(a => a.level === '核心' || a.level === '入门')
          .sort((a, b) => (b.learnCount || 0) - (a.learnCount || 0))
          .slice(0, 5);

        this.setData({
          audioList: audios,
          recommended
        });
      },
      fail: () => {
        // 加载本地示例数据
        this.loadSampleAudios();
      }
    });
  },

  /**
   * 加载示例音频（备用）
   */
  loadSampleAudios() {
    const samples = [
      {
        id: 'SIG001',
        category: '信号音',
        categoryId: 'signal',
        name: '喂食信号音',
        summary: '建立条件反射，让鹦鹉听到信号就期待进食',
        duration: 5,
        difficulty: 1,
        level: '核心',
        learnCount: 152345,
        rating: 4.9,
        averageLearnDays: 5
      },
      {
        id: 'SIG002',
        category: '信号音',
        categoryId: 'signal',
        name: '欢迎主人音',
        summary: '训练鹦鹉在主人回家时兴奋迎接',
        duration: 10,
        difficulty: 2,
        level: '核心',
        learnCount: 98234,
        rating: 4.8,
        averageLearnDays: 14
      },
      {
        id: 'SNG002',
        category: '唱歌训练',
        categoryId: 'singing',
        name: '小星星旋律',
        summary: '经典儿歌，重复性强易学习',
        duration: 45,
        difficulty: 1,
        level: '入门',
        learnCount: 123456,
        rating: 4.8,
        averageLearnDays: 21
      },
      {
        id: 'SKL001',
        category: '技巧训练',
        categoryId: 'skill',
        name: '你好',
        summary: '基础问候语，最实用的指令',
        duration: 10,
        difficulty: 1,
        level: '入门',
        learnCount: 234567,
        rating: 4.9,
        averageLearnDays: 14
      },
      {
        id: 'BEH001',
        category: '行为训练',
        categoryId: 'behavior',
        name: '上来',
        summary: '站上手指指令，最基础的行为训练',
        duration: 10,
        difficulty: 1,
        level: '入门',
        learnCount: 187654,
        rating: 4.9,
        averageLearnDays: 7
      }
    ];

    this.setData({
      audioList: samples,
      recommended: samples.slice(0, 3)
    });
  },

  /**
   * 加载训练统计
   */
  loadTrainingStats() {
    const parrots = storage.getAllParrots();
    if (parrots.length === 0) return;

    const parrot = parrots[0];
    const trainings = storage.getParrotTrainings(parrot.id);

    // 简单统计
    const stats = {
      mastered: Math.floor(trainings.length * 0.3),
      learning: Math.floor(trainings.length * 0.5),
      total: trainings.length
    };

    const totalAudios = this.data.audioList.length;
    const progressPercent = totalAudios > 0 ? Math.floor((stats.mastered / totalAudios) * 100) : 0;

    this.setData({
      stats,
      progressPercent
    });
  },

  /**
   * 设置分类
   */
  setCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat });
    this.loadAudios();
  },

  /**
   * 获取图标
   */
  getIcon(categoryId) {
    const icons = {
      'signal': '🔔',
      'nature': '💬',
      'singing': '🎤',
      'skill': '🧠',
      'behavior': '🎯',
      'environment': '🌿'
    };
    return icons[categoryId] || '🎵';
  },

  /**
   * 播放音频
   */
  playAudio(e) {
    const audio = e.currentTarget.dataset.audio;
    
    this.setData({
      currentAudio: audio,
      showPlayer: true,
      isPlaying: false,
      currentTime: '00:00',
      progress: 0
    });

    // 创建音频上下文
    if (!this.audioContext) {
      this.audioContext = wx.createInnerAudioContext();
      
      this.audioContext.onTimeUpdate(() => {
        const current = Math.floor(this.audioContext.currentTime);
        const minutes = Math.floor(current / 60);
        const seconds = current % 60;
        const progress = (current / audio.duration) * 100;
        
        this.setData({
          currentTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
          progress
        });
      });

      this.audioContext.onEnded(() => {
        this.setData({
          isPlaying: false,
          currentTime: '00:00',
          progress: 0
        });
      });
    }

    // 设置音频源（实际使用时需要真实音频文件）
    // this.audioContext.src = audio.audioPath;
    
    wx.showToast({
      title: '播放：' + audio.name,
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 切换播放/暂停
   */
  togglePlay() {
    if (!this.data.currentAudio) return;

    if (this.data.isPlaying) {
      this.audioContext.pause();
      this.setData({ isPlaying: false });
    } else {
      // 如果是第一次播放，需要设置 src
      if (!this.audioContext.src) {
        // this.audioContext.src = this.data.currentAudio.audioPath;
      }
      this.audioContext.play();
      this.setData({ isPlaying: true });
    }
  },

  /**
   * 调整进度
   */
  seekAudio(e) {
    const value = e.detail.value;
    const duration = this.data.currentAudio.duration;
    const seekTime = (value / 100) * duration;
    
    this.audioContext.seek(seekTime);
    this.setData({ progress: value });
  },

  /**
   * 打开播放器
   */
  openPlayer() {
    this.setData({ showPlayer: true });
  },

  /**
   * 关闭播放器
   */
  closePlayer() {
    this.setData({ showPlayer: false });
  },

  /**
   * 开始录音训练
   */
  startTraining() {
    if (!this.data.currentAudio) return;

    wx.navigateTo({
      url: '/pages/training/recording/recording?audioId=' + this.data.currentAudio.id
    });
  },

  /**
   * 搜索音频
   */
  searchAudio() {
    wx.showModal({
      title: '搜索功能',
      content: '搜索功能开发中，敬请期待～',
      showCancel: false
    });
  }
});

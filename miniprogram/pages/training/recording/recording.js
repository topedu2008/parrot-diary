/**
 * 录音训练页面
 */
const storage = require('../../../utils/storage.js');

Page({
  data: {
    audioId: '',
    audioName: '',
    audioSummary: '',
    audioIcon: '🎵',
    parrotName: '',
    isRecording: false,
    formatTime: '00:00',
    recordings: [],
    currentRecording: null
  },

  onLoad(options) {
    this.data.audioId = options.audioId;
    this.loadAudioInfo();
    this.loadParrot();
  },

  onUnload() {
    // 停止录音
    if (this.recorderManager) {
      this.recorderManager.stop();
    }
    // 停止播放
    if (this.audioContext) {
      this.audioContext.stop();
    }
  },

  /**
   * 加载音频信息
   */
  loadAudioInfo() {
    // 从 audios.json 加载
    wx.request({
      url: '/data/audios.json',
      success: (res) => {
        const audio = res.data.find(a => a.id === this.data.audioId);
        if (audio) {
          this.setData({
            audioName: audio.name,
            audioSummary: audio.summary,
            audioIcon: this.getIcon(audio.categoryId)
          });
        }
      }
    });
  },

  /**
   * 加载鹦鹉信息
   */
  loadParrot() {
    const parrots = storage.getAllParrots();
    if (parrots.length > 0) {
      this.setData({ parrotName: parrots[0].name });
    }
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
   * 切换录音
   */
  toggleRecording() {
    if (this.data.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  /**
   * 开始录音
   */
  startRecording() {
    if (!this.recorderManager) {
      this.recorderManager = wx.getRecorderManager();

      this.recorderManager.onStart(() => {
        console.log('录音开始');
      });

      this.recorderManager.onStop((res) => {
        console.log('录音停止', res);
        
        if (res.duration < 1000) {
          wx.showToast({
            title: '录音时间太短',
            icon: 'none'
          });
          return;
        }

        // 保存录音文件
        const savedPath = storage.saveFile(res.tempFilePath, 'trainings/' + this.data.audioId);
        
        if (savedPath) {
          const recording = {
            id: 'rec_' + Date.now(),
            path: savedPath,
            duration: Math.floor(res.duration / 1000),
            createdAt: this.getCurrentTime(),
            rating: 0,
            playing: false
          };

          const recordings = [recording, ...this.data.recordings];
          this.setData({ recordings });

          wx.showToast({
            title: '录音已保存',
            icon: 'success'
          });
        }
      });

      this.recorderManager.onError((err) => {
        console.error('录音错误', err);
        wx.showToast({
          title: '录音失败',
          icon: 'none'
        });
      });
    }

    // 开始录音
    this.recorderManager.start({
      duration: 60000, // 最长 60 秒
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 128000
    });

    this.setData({ isRecording: true });

    // 开始计时
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      this.setData({
        formatTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      });
    }, 1000);
  },

  /**
   * 停止录音
   */
  stopRecording() {
    if (this.recorderManager) {
      this.recorderManager.stop();
    }

    this.setData({
      isRecording: false,
      formatTime: '00:00'
    });

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  /**
   * 播放录音
   */
  playRecording(e) {
    const url = e.currentTarget.dataset.url;
    const id = e.currentTarget.parentElement.dataset.id;

    // 停止当前播放
    if (this.audioContext) {
      this.audioContext.stop();
    }

    // 创建音频上下文
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.src = url;

    this.audioContext.play();
    wx.showToast({
      title: '播放中...',
      icon: 'none'
    });

    this.audioContext.onEnded(() => {
      wx.showToast({
        title: '播放完成',
        icon: 'none'
      });
    });
  },

  /**
   * 评分
   */
  rateRecording(e) {
    const id = e.currentTarget.dataset.id;
    const rating = e.currentTarget.dataset.rating;

    const recordings = this.data.recordings.map(r => {
      if (r.id === id) {
        return { ...r, rating };
      }
      return r;
    });

    this.setData({ recordings });

    wx.showToast({
      title: `评分：${rating}星`,
      icon: 'none'
    });
  },

  /**
   * 删除录音
   */
  deleteRecording(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条录音吗？',
      success: (res) => {
        if (res.confirm) {
          const recordings = this.data.recordings.filter(r => r.id !== id);
          this.setData({ recordings });

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 保存训练记录
   */
  saveTraining() {
    if (this.data.recordings.length === 0) {
      wx.showToast({
        title: '请先录音',
        icon: 'none'
      });
      return;
    }

    const parrots = storage.getAllParrots();
    if (parrots.length === 0) return;

    const parrot = parrots[0];

    // 保存训练记录
    storage.addTraining(parrot.id, {
      audioId: this.data.audioId,
      audioName: this.data.audioName,
      recordings: this.data.recordings,
      note: '',
      rating: this.calculateAverageRating()
    });

    wx.showToast({
      title: '训练已保存',
      icon: 'success'
    });

    // 返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  /**
   * 计算平均评分
   */
  calculateAverageRating() {
    if (this.data.recordings.length === 0) return 0;
    const total = this.data.recordings.reduce((sum, r) => sum + r.rating, 0);
    return Math.floor(total / this.data.recordings.length);
  },

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
});

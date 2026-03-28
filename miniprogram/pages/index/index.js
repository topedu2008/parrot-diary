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
      trainings: 0
    },
    recentPhotos: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
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
      
      // 计算统计
      const photos = storage.getParrotMedia(parrot.id);
      const trainings = storage.getParrotTrainings(parrot.id);
      const days = this.calculateDays(parrot.createdAt);
      
      this.setData({
        stats: {
          days,
          photos: photos.length,
          trainings: trainings.length
        },
        recentPhotos: photos.slice(0, 6)
      });
    }
  },

  /**
   * 计算饲养天数
   */
  calculateDays(createdAt) {
    const start = new Date(createdAt);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
   * 拍照
   */
  takePhoto() {
    if (!this.data.currentParrot) {
      wx.showToast({
        title: '请先添加鹦鹉',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        // 保存文件
        const savedPath = storage.saveFile(tempFilePath, 'albums/' + this.data.currentParrot.id);
        
        if (savedPath) {
          // 添加到相册
          storage.addMedia(this.data.currentParrot.id, {
            type: 'photo',
            path: savedPath,
            caption: '新照片',
            tags: []
          });

          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });

          this.loadData();
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      }
    });
  },

  /**
   * 跳转到训练
   */
  goToTraining() {
    wx.switchTab({
      url: '/pages/training/training'
    });
  },

  /**
   * 写日记
   */
  writeDiary() {
    if (!this.data.currentParrot) {
      wx.showToast({
        title: '请先添加鹦鹉',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/diary/write/write?parrotId=' + this.data.currentParrot.id
    });
  },

  /**
   * 查看统计
   */
  viewStats() {
    wx.navigateTo({
      url: '/pages/profile/stats/stats'
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

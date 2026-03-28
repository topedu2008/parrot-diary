/**
 * 相册页面
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    currentParrot: null,
    filterType: 'all', // all, photo, video, favorite
    mediaList: [],
    groupedMedia: []
  },

  onLoad() {
    this.loadParrot();
  },

  onShow() {
    this.loadMedia();
  },

  onPullDownRefresh() {
    this.loadMedia();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载当前鹦鹉
   */
  loadParrot() {
    const parrots = storage.getAllParrots();
    if (parrots.length > 0) {
      this.setData({ currentParrot: parrots[0] });
      this.loadMedia();
    } else {
      wx.showModal({
        title: '提示',
        content: '请先添加鹦鹉档案',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/profile/add-parrot/add-parrot'
            });
          }
        }
      });
    }
  },

  /**
   * 加载媒体列表
   */
  loadMedia() {
    if (!this.data.currentParrot) return;

    let media = storage.getParrotMedia(this.data.currentParrot.id);

    // 格式化日期
    media = media.map(item => ({
      ...item,
      date: this.formatDate(item.createdAt)
    }));

    // 应用筛选
    if (this.data.filterType === 'photo') {
      media = media.filter(m => m.type === 'photo');
    } else if (this.data.filterType === 'video') {
      media = media.filter(m => m.type === 'video');
    } else if (this.data.filterType === 'favorite') {
      media = media.filter(m => m.favorite);
    }

    this.setData({ mediaList: media });

    // 分组显示（按月份）
    this.groupByMonth(media);
  },

  /**
   * 按月份分组
   */
  groupByMonth(media) {
    const groups = {};
    
    media.forEach(item => {
      const date = new Date(item.createdAt);
      const month = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(item);
    });

    const grouped = Object.keys(groups).map(month => ({
      month,
      items: groups[month]
    }));

    this.setData({ groupedMedia: grouped });
  },

  /**
   * 设置筛选
   */
  setFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.loadMedia();
  },

  /**
   * 上传照片/视频
   */
  uploadPhoto() {
    if (!this.data.currentParrot) return;

    wx.chooseMedia({
      count: 9,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 5, // 视频最长 5 秒
      success: (res) => {
        wx.showLoading({ title: '保存中...' });

        let count = 0;
        res.tempFiles.forEach(file => {
          const savedPath = storage.saveFile(
            file.tempFilePath,
            'albums/' + this.data.currentParrot.id
          );

          if (savedPath) {
            storage.addMedia(this.data.currentParrot.id, {
              type: file.fileType === 'image' ? 'photo' : 'video',
              path: savedPath,
              caption: '',
              tags: [],
              duration: file.duration
            });
          }

          count++;
          if (count === res.tempFiles.length) {
            wx.hideLoading();
            wx.showToast({
              title: `成功保存 ${res.tempFiles.length} 个文件`,
              icon: 'success'
            });
            this.loadMedia();
          }
        });
      }
    });
  },

  /**
   * 预览媒体
   */
  previewMedia(e) {
    const index = e.currentTarget.dataset.index;
    const media = this.data.mediaList[index];

    if (media.type === 'photo') {
      wx.previewImage({
        current: media.path,
        urls: this.data.mediaList.map(m => m.path)
      });
    } else {
      // 播放视频
      wx.previewMedia({
        sources: [{
          url: media.path,
          type: 'video'
        }]
      });
    }
  },

  /**
   * 切换收藏
   */
  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const media = this.data.mediaList.find(m => m.id === id);
    
    if (media) {
      media.favorite = !media.favorite;
      this.setData({ mediaList: this.data.mediaList });
      
      wx.showToast({
        title: media.favorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      });
    }
  },

  /**
   * 删除媒体
   */
  deleteMedia(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张照片/视频吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteMedia(this.data.currentParrot.id, id);
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
          this.loadMedia();
        }
      }
    });
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
      return `今天 ${this.formatTime(date)}`;
    }
    
    // 昨天
    if (diff < 48 * 60 * 60 * 1000) {
      return `昨天 ${this.formatTime(date)}`;
    }
    
    // 其他日期
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
});

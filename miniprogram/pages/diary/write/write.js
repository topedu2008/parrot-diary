/**
 * 写日记页面
 */
const storage = require('../../../utils/storage.js');

Page({
  data: {
    parrots: [],
    parrotIndex: 0,
    mood: 'happy',
    content: '',
    contentLength: 0,
    photos: [],
    tags: [],
    tagInput: '',
    isPublic: false,
    isEdit: false,
    canPublish: false,
    suggestedTags: ['成长', '训练', '日常', '有趣', '第一次']
  },

  onLoad() {
    this.loadParrots();
  },

  /**
   * 加载鹦鹉列表
   */
  loadParrots() {
    const parrots = storage.getAllParrots();
    this.setData({ 
      parrots,
      parrotIndex: parrots.length > 0 ? 0 : -1
    });
    this.updateCanPublish();
  },

  /**
   * 选择鹦鹉
   */
  onParrotChange(e) {
    this.setData({ parrotIndex: e.detail.value });
  },

  /**
   * 选择心情
   */
  selectMood(e) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({ mood });
  },

  /**
   * 输入内容
   */
  onContentInput(e) {
    const content = e.detail.value;
    this.setData({ 
      content,
      contentLength: content.length
    });
    this.updateCanPublish();
  },

  /**
   * 添加照片
   */
  addPhoto() {
    if (this.data.photos.length >= 9) {
      wx.showToast({
        title: '最多 9 张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 9 - this.data.photos.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const photos = [...this.data.photos];
        
        res.tempFiles.forEach(file => {
          const savedPath = storage.saveFile(file.tempFilePath, 'diaries/photos');
          if (savedPath) {
            photos.push(savedPath);
          }
        });

        this.setData({ photos });
      }
    });
  },

  /**
   * 删除照片
   */
  deletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.photos.filter((_, i) => i !== index);
    this.setData({ photos });
  },

  /**
   * 输入标签
   */
  onTagInput(e) {
    this.setData({ tagInput: e.detail.value });
  },

  /**
   * 添加标签
   */
  addTag(e) {
    const tag = e.detail.value.trim();
    if (tag && !this.data.tags.includes(tag)) {
      const tags = [...this.data.tags, tag];
      this.setData({ 
        tags,
        tagInput: ''
      });
    }
  },

  /**
   * 添加推荐标签
   */
  addSuggestedTag(e) {
    const tag = e.currentTarget.dataset.tag;
    if (!this.data.tags.includes(tag)) {
      const tags = [...this.data.tags, tag];
      this.setData({ tags });
    }
  },

  /**
   * 删除标签
   */
  removeTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags.filter((_, i) => i !== index);
    this.setData({ tags });
  },

  /**
   * 设置隐私
   */
  setPrivacy(e) {
    const isPublic = e.currentTarget.dataset.public;
    this.setData({ isPublic });
  },

  /**
   * 更新发布状态
   */
  updateCanPublish() {
    const canPublish = this.data.parrots.length > 0 && this.data.content.trim().length > 0;
    this.setData({ canPublish });
  },

  /**
   * 发布日记
   */
  publish() {
    if (!this.data.canPublish) {
      wx.showToast({
        title: '请填写日记内容',
        icon: 'none'
      });
      return;
    }

    const parrot = this.data.parrots[this.data.parrotIndex];
    
    wx.showLoading({ title: '发布中...' });

    // 保存日记
    const diary = {
      parrotId: parrot.id,
      mood: this.data.mood,
      content: this.data.content,
      images: this.data.photos,
      tags: this.data.tags,
      isPublic: this.data.isPublic,
      likes: 0,
      comments: 0
    };

    storage.addDiary(parrot.id, diary);

    wx.hideLoading();
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });

    // 返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});

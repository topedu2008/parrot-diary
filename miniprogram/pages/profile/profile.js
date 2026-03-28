/**
 * 个人中心页面
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    userInfo: null,
    parrots: [],
    stats: {
      parrotCount: 0,
      mediaCount: 0,
      trainingCount: 0,
      diaryCount: 0
    }
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
    // 用户信息
    const userInfo = storage.getUserInfo() || {
      nickName: '鹦鹉主人',
      id: '123456'
    };
    this.setData({ userInfo });

    // 鹦鹉列表
    const parrots = storage.getAllParrots();
    const parrotsWithAge = parrots.map(p => ({
      ...p,
      age: this.calculateAge(p.birthday)
    }));
    this.setData({ parrots: parrotsWithAge });

    // 统计信息
    const stats = this.calculateStats(parrots);
    this.setData({ stats });
  },

  /**
   * 计算年龄
   */
  calculateAge(birthday) {
    if (!birthday) return 0;
    const birth = new Date(birthday);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      return years - 1;
    }
    return years;
  },

  /**
   * 计算统计
   */
  calculateStats(parrots) {
    let mediaCount = 0;
    let trainingCount = 0;
    let diaryCount = 0;

    parrots.forEach(parrot => {
      mediaCount += storage.getParrotMedia(parrot.id).length;
      trainingCount += storage.getParrotTrainings(parrot.id).length;
      diaryCount += storage.getParrotDiaries(parrot.id).length;
    });

    return {
      parrotCount: parrots.length,
      mediaCount,
      trainingCount,
      diaryCount
    };
  },

  /**
   * 编辑资料
   */
  editProfile() {
    wx.showModal({
      title: '编辑资料',
      content: '编辑资料功能开发中，敬请期待～',
      showCancel: false
    });
  },

  /**
   * 设置
   */
  goSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
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
   * 跳转到训练
   */
  goToTraining() {
    wx.switchTab({
      url: '/pages/training/training'
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
   * 编辑鹦鹉
   */
  editParrot(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/profile/add-parrot/add-parrot?id=' + id
    });
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
   * 导出数据
   */
  exportData() {
    const data = storage.exportData();
    
    wx.showLoading({ title: '生成中...' });
    
    // 保存到临时文件
    const fileName = `parrot-diary-backup-${Date.now()}.json`;
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    const fs = wx.getFileSystemManager();
    fs.writeFile({
      filePath,
      data: data,
      encoding: 'utf8',
      success: () => {
        wx.hideLoading();
        
        wx.showModal({
          title: '导出成功',
          content: `数据已保存到：${fileName}\n\n请在文件管理器中查找该文件进行备份`,
          showCancel: false
        });
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '导出失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 导入数据
   */
  importData() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json'],
      success: (res) => {
        const filePath = res.tempFiles[0].path;
        
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath,
          encoding: 'utf8',
          success: (readRes) => {
            const success = storage.importData(readRes.data);
            
            if (success) {
              wx.showModal({
                title: '导入成功',
                content: '数据已成功恢复，部分页面可能需要重新加载',
                showCancel: false,
                success: () => {
                  this.loadData();
                }
              });
            } else {
              wx.showToast({
                title: '导入失败',
                icon: 'none'
              });
            }
          }
        });
      }
    });
  },

  /**
   * 意见反馈
   */
  giveFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！\n\n请添加客服微信：parrot-diary\n或发送邮件至：feedback@parrot-diary.com',
      showCancel: false
    });
  },

  /**
   * 检查更新
   */
  checkUpdate() {
    wx.showLoading({ title: '检查中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '检查更新',
        content: '当前已是最新版本 (v1.0.0)',
        showCancel: false
      });
    }, 1000);
  },

  /**
   * 关于我们
   */
  aboutApp() {
    wx.showModal({
      title: '关于鹦鹉成长日记',
      content: '版本：1.0.0\n\n鹦鹉成长日记是一款专为鹦鹉主人设计的记录工具，帮助你科学饲养、记录成长、留下美好回忆。\n\n开发者：用户 EF5F\n公众号：（待补充）',
      showCancel: false
    });
  }
});

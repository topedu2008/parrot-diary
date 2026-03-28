/**
 * 鹦鹉成长日记 - 小程序入口
 */

App({
  onLaunch() {
    console.log('🦜 鹦鹉成长日记启动');
    
    // 检查本地存储
    const storage = require('./utils/storage.js');
    
    // 初始化用户信息
    const userInfo = storage.getUserInfo();
    if (!userInfo) {
      // 首次使用，创建默认用户
      storage.saveUserInfo({
        nickName: '鹦鹉主人',
        avatarUrl: '',
        createdAt: new Date().toISOString()
      });
    }
    
    // 检查存储空间
    this.checkStorageInfo();
  },
  
  /**
   * 检查存储空间
   */
  checkStorageInfo() {
    wx.getStorageInfo({
      success: (res) => {
        console.log('存储空间:', res);
        const usagePercent = ((res.currentSize / 10240) * 100).toFixed(2); // 10MB limit
        console.log(`存储使用：${usagePercent}%`);
        
        if (usagePercent > 80) {
          wx.showModal({
            title: '存储空间不足',
            content: '存储使用已超过 80%，建议清理缓存或导出数据',
            showCancel: false,
            confirmText: '知道了'
          });
        }
      }
    });
  },
  
  /**
   * 全局数据
   */
  globalData: {
    version: '1.0.0',
    parrotCount: 0,
    mediaCount: 0,
    trainingCount: 0,
    diaryCount: 0
  }
});

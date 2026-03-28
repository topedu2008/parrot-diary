/**
 * 本地存储封装工具类
 * 用于管理小程序的本地数据存储
 */

const STORAGE_KEY = {
  USER_INFO: 'user_info',
  PARROTS: 'parrots',
  ALBUMS: 'albums',
  TRAININGS: 'trainings',
  DIARIES: 'diaries',
  SETTINGS: 'settings'
};

class StorageManager {
  constructor() {
    this.fs = wx.getFileSystemManager();
  }

  // ==================== 基础存储方法 ====================

  /**
   * 保存数据
   * @param {string} key 存储键
   * @param {any} data 数据
   */
  save(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('存储失败', key, e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
      return false;
    }
  }

  /**
   * 读取数据
   * @param {string} key 存储键
   */
  get(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      console.error('读取失败', key, e);
      return null;
    }
  }

  /**
   * 删除数据
   * @param {string} key 存储键
   */
  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('删除失败', key, e);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清空失败', e);
      return false;
    }
  }

  // ==================== 用户信息 ====================

  /**
   * 保存用户信息
   * @param {Object} userInfo 用户信息
   */
  saveUserInfo(userInfo) {
    return this.save(STORAGE_KEY.USER_INFO, userInfo);
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.get(STORAGE_KEY.USER_INFO);
  }

  // ==================== 鹦鹉管理 ====================

  /**
   * 添加鹦鹉
   * @param {Object} parrot 鹦鹉信息
   * @returns {Object} 添加的鹦鹉（含 ID）
   */
  addParrot(parrot) {
    const parrots = this.get(STORAGE_KEY.PARROTS) || [];
    const newParrot = {
      ...parrot,
      id: 'parrot_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    parrots.push(newParrot);
    this.save(STORAGE_KEY.PARROTS, parrots);
    return newParrot;
  }

  /**
   * 获取所有鹦鹉
   */
  getAllParrots() {
    return this.get(STORAGE_KEY.PARROTS) || [];
  }

  /**
   * 根据 ID 获取鹦鹉
   * @param {string} parrotId 鹦鹉 ID
   */
  getParrotById(parrotId) {
    const parrots = this.getAllParrots();
    return parrots.find(p => p.id === parrotId);
  }

  /**
   * 更新鹦鹉信息
   * @param {string} parrotId 鹦鹉 ID
   * @param {Object} data 更新的数据
   */
  updateParrot(parrotId, data) {
    const parrots = this.getAllParrots();
    const index = parrots.findIndex(p => p.id === parrotId);
    if (index !== -1) {
      parrots[index] = { ...parrots[index], ...data };
      this.save(STORAGE_KEY.PARROTS, parrots);
      return true;
    }
    return false;
  }

  /**
   * 删除鹦鹉
   * @param {string} parrotId 鹦鹉 ID
   */
  deleteParrot(parrotId) {
    const parrots = this.getAllParrots();
    const filtered = parrots.filter(p => p.id !== parrotId);
    this.save(STORAGE_KEY.PARROTS, filtered);
    
    // 同时删除相关数据
    this.deleteParrotData(parrotId);
    return true;
  }

  /**
   * 删除鹦鹉相关数据
   * @param {string} parrotId 鹦鹉 ID
   */
  deleteParrotData(parrotId) {
    // 删除相册
    const albums = this.get(STORAGE_KEY.ALBUMS) || {};
    delete albums[parrotId];
    this.save(STORAGE_KEY.ALBUMS, albums);

    // 删除训练记录
    const trainings = this.get(STORAGE_KEY.TRAININGS) || {};
    delete trainings[parrotId];
    this.save(STORAGE_KEY.TRAININGS, trainings);

    // 删除日记
    const diaries = this.get(STORAGE_KEY.DIARIES) || {};
    delete diaries[parrotId];
    this.save(STORAGE_KEY.DIARIES, diaries);
  }

  // ==================== 相册管理 ====================

  /**
   * 添加照片/视频
   * @param {string} parrotId 鹦鹉 ID
   * @param {Object} media 媒体信息
   * @returns {Object} 添加的媒体（含 ID）
   */
  addMedia(parrotId, media) {
    const albums = this.get(STORAGE_KEY.ALBUMS) || {};
    if (!albums[parrotId]) {
      albums[parrotId] = [];
    }

    const newMedia = {
      ...media,
      id: 'media_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    // 添加到开头（最新的在前）
    albums[parrotId].unshift(newMedia);
    this.save(STORAGE_KEY.ALBUMS, albums);
    return newMedia;
  }

  /**
   * 获取鹦鹉的所有照片/视频
   * @param {string} parrotId 鹦鹉 ID
   */
  getParrotMedia(parrotId) {
    const albums = this.get(STORAGE_KEY.ALBUMS) || {};
    return albums[parrotId] || [];
  }

  /**
   * 删除媒体
   * @param {string} parrotId 鹦鹉 ID
   * @param {string} mediaId 媒体 ID
   */
  deleteMedia(parrotId, mediaId) {
    const albums = this.get(STORAGE_KEY.ALBUMS) || {};
    if (albums[parrotId]) {
      albums[parrotId] = albums[parrotId].filter(m => m.id !== mediaId);
      this.save(STORAGE_KEY.ALBUMS, albums);
      
      // 删除文件
      const media = this.getMediaById(parrotId, mediaId);
      if (media && media.path) {
        this.deleteFile(media.path);
      }
      
      return true;
    }
    return false;
  }

  /**
   * 根据 ID 获取媒体
   * @param {string} parrotId 鹦鹉 ID
   * @param {string} mediaId 媒体 ID
   */
  getMediaById(parrotId, mediaId) {
    const mediaList = this.getParrotMedia(parrotId);
    return mediaList.find(m => m.id === mediaId);
  }

  // ==================== 训练记录 ====================

  /**
   * 添加训练记录
   * @param {string} parrotId 鹦鹉 ID
   * @param {Object} training 训练信息
   * @returns {Object} 添加的训练记录（含 ID）
   */
  addTraining(parrotId, training) {
    const trainings = this.get(STORAGE_KEY.TRAININGS) || {};
    if (!trainings[parrotId]) {
      trainings[parrotId] = [];
    }

    const newTraining = {
      ...training,
      id: 'training_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    trainings[parrotId].unshift(newTraining);
    this.save(STORAGE_KEY.TRAININGS, trainings);
    return newTraining;
  }

  /**
   * 获取鹦鹉的所有训练记录
   * @param {string} parrotId 鹦鹉 ID
   */
  getParrotTrainings(parrotId) {
    const trainings = this.get(STORAGE_KEY.TRAININGS) || {};
    return trainings[parrotId] || [];
  }

  /**
   * 删除训练记录
   * @param {string} parrotId 鹦鹉 ID
   * @param {string} trainingId 训练 ID
   */
  deleteTraining(parrotId, trainingId) {
    const trainings = this.get(STORAGE_KEY.TRAININGS) || {};
    if (trainings[parrotId]) {
      const training = trainings[parrotId].find(t => t.id === trainingId);
      trainings[parrotId] = trainings[parrotId].filter(t => t.id !== trainingId);
      this.save(STORAGE_KEY.TRAININGS, trainings);
      
      // 删除录音文件
      if (training && training.recordingPath) {
        this.deleteFile(training.recordingPath);
      }
      
      return true;
    }
    return false;
  }

  // ==================== 日记管理 ====================

  /**
   * 添加日记
   * @param {string} parrotId 鹦鹉 ID
   * @param {Object} diary 日记信息
   * @returns {Object} 添加的日记（含 ID）
   */
  addDiary(parrotId, diary) {
    const diaries = this.get(STORAGE_KEY.DIARIES) || {};
    if (!diaries[parrotId]) {
      diaries[parrotId] = [];
    }

    const newDiary = {
      ...diary,
      id: 'diary_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    diaries[parrotId].unshift(newDiary);
    this.save(STORAGE_KEY.DIARIES, diaries);
    return newDiary;
  }

  /**
   * 获取鹦鹉的所有日记
   * @param {string} parrotId 鹦鹉 ID
   */
  getParrotDiaries(parrotId) {
    const diaries = this.get(STORAGE_KEY.DIARIES) || {};
    return diaries[parrotId] || [];
  }

  /**
   * 删除日记
   * @param {string} parrotId 鹦鹉 ID
   * @param {string} diaryId 日记 ID
   */
  deleteDiary(parrotId, diaryId) {
    const diaries = this.get(STORAGE_KEY.DIARIES) || {};
    if (diaries[parrotId]) {
      const diary = diaries[parrotId].find(d => d.id === diaryId);
      diaries[parrotId] = diaries[parrotId].filter(d => d.id !== diaryId);
      this.save(STORAGE_KEY.DIARIES, diaries);
      
      // 删除日记图片
      if (diary && diary.images) {
        diary.images.forEach(imgPath => this.deleteFile(imgPath));
      }
      
      return true;
    }
    return false;
  }

  // ==================== 文件管理 ====================

  /**
   * 保存文件
   * @param {string} filePath 临时文件路径
   * @param {string} subDir 子目录（如：albums/parrot_001）
   * @returns {string} 保存后的文件路径
   */
  saveFile(filePath, subDir) {
    try {
      const fileName = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const ext = filePath.split('.').pop();
      const newFileName = fileName + '.' + ext;
      
      // 用户文件目录
      const userDir = wx.env.USER_DATA_PATH + '/parrot-diary/' + subDir;
      
      // 创建目录（如果不存在）
      try {
        this.fs.accessSync(userDir);
      } catch (e) {
        this.fs.mkdirSync(userDir, true);
      }
      
      const newPath = userDir + '/' + newFileName;
      
      // 复制文件
      this.fs.copyFileSync(filePath, newPath);
      
      return newPath;
    } catch (e) {
      console.error('保存文件失败', e);
      return null;
    }
  }

  /**
   * 删除文件
   * @param {string} filePath 文件路径
   */
  deleteFile(filePath) {
    try {
      if (filePath) {
        this.fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (e) {
      console.error('删除文件失败', filePath, e);
      return false;
    }
  }

  /**
   * 压缩图片
   * @param {string} filePath 图片路径
   * @param {number} quality 质量 (0.5-0.8)
   * @returns {string} 压缩后的图片路径
   */
  async compressImage(filePath, quality = 0.6) {
    // 微信提供图片压缩 API
    const res = await new Promise((resolve, reject) => {
      wx.compressImage({
        src: filePath,
        quality: Math.round(quality * 100),
        success: resolve,
        fail: reject
      });
    });
    return res.tempFilePath;
  }

  // ==================== 数据导出/导入 ====================

  /**
   * 导出数据
   * @returns {string} JSON 字符串
   */
  exportData() {
    const data = {
      version: '1.0',
      exportAt: new Date().toISOString(),
      user: this.getUserInfo(),
      parrots: this.getAllParrots(),
      albums: this.get(STORAGE_KEY.ALBUMS),
      trainings: this.get(STORAGE_KEY.TRAININGS),
      diaries: this.get(STORAGE_KEY.DIARIES)
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入数据
   * @param {string} json JSON 字符串
   * @returns {boolean} 是否成功
   */
  importData(json) {
    try {
      const data = JSON.parse(json);
      
      if (data.user) this.saveUserInfo(data.user);
      if (data.parrots) this.save(STORAGE_KEY.PARROTS, data.parrots);
      if (data.albums) this.save(STORAGE_KEY.ALBUMS, data.albums);
      if (data.trainings) this.save(STORAGE_KEY.TRAININGS, data.trainings);
      if (data.diaries) this.save(STORAGE_KEY.DIARIES, data.diaries);
      
      return true;
    } catch (e) {
      console.error('导入数据失败', e);
      return false;
    }
  }

  // ==================== 统计信息 ====================

  /**
   * 获取统计信息
   */
  getStats() {
    const parrots = this.getAllParrots();
    const albums = this.get(STORAGE_KEY.ALBUMS) || {};
    const trainings = this.get(STORAGE_KEY.TRAININGS) || {};
    const diaries = this.get(STORAGE_KEY.DIARIES) || {};

    let totalMedia = 0;
    let totalTrainings = 0;
    let totalDiaries = 0;

    Object.values(albums).forEach(list => totalMedia += list.length);
    Object.values(trainings).forEach(list => totalTrainings += list.length);
    Object.values(diaries).forEach(list => totalDiaries += list.length);

    return {
      parrotCount: parrots.length,
      mediaCount: totalMedia,
      trainingCount: totalTrainings,
      diaryCount: totalDiaries
    };
  }
}

// 导出单例
export default new StorageManager();

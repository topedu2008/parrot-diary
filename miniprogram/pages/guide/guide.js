/**
 * 饲养指南页面
 */
const storage = require('../../utils/storage.js');

Page({
  data: {
    articles: [],
    recommended: [],
    currentFilter: 'all', // all, official, user
    currentCategory: 'all',
    hasMore: true,
    stats: {
      food: 0,
      environment: 0,
      health: 0,
      behavior: 0
    }
  },

  onLoad() {
    this.loadGuides();
  },

  onPullDownRefresh() {
    this.loadGuides();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载饲养指南
   */
  loadGuides() {
    // 从本地数据加载
    wx.request({
      url: '/data/guides.json',
      success: (res) => {
        const guides = res.data;
        
        // 计算分类统计
        const stats = {
          food: guides.filter(g => g.categoryId === 'food').length,
          environment: guides.filter(g => g.categoryId === 'environment').length,
          health: guides.filter(g => g.categoryId === 'health').length,
          behavior: guides.filter(g => g.categoryId === 'behavior').length
        };

        // 推荐文章（按浏览量和收藏数排序）
        const recommended = [...guides]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);

        // 最新文章
        const articles = [...guides]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        this.setData({
          articles,
          recommended,
          stats
        });
      },
      fail: () => {
        // 如果请求失败，使用本地导入的数据
        this.loadLocalGuides();
      }
    });
  },

  /**
   * 加载本地指南（备用方案）
   */
  loadLocalGuides() {
    // 这里可以预置一些示例数据
    const sampleGuides = [
      {
        id: 'guide_001',
        category: '饮食',
        categoryId: 'food',
        title: '鹦鹉绝对不能吃的 10 种食物',
        summary: '有些对人类安全的食物对鹦鹉却是致命的',
        difficulty: 1,
        readTime: 5,
        views: 152000,
        favorites: 32000,
        source: 'official',
        updatedAt: '2026-03-20'
      },
      {
        id: 'guide_002',
        category: '环境',
        categoryId: 'environment',
        title: '如何选择合适的鹦鹉笼',
        summary: '笼子是鹦鹉的家，选对笼子至关重要',
        difficulty: 1,
        readTime: 7,
        views: 125000,
        favorites: 28000,
        source: 'official',
        updatedAt: '2026-03-10'
      },
      {
        id: 'guide_003',
        category: '健康',
        categoryId: 'health',
        title: '如何判断鹦鹉是否生病',
        summary: '鹦鹉会隐藏病情，学会识别早期症状很重要',
        difficulty: 2,
        readTime: 8,
        views: 98000,
        favorites: 22000,
        source: 'official',
        updatedAt: '2026-03-18'
      }
    ];

    const stats = {
      food: 1,
      environment: 1,
      health: 1,
      behavior: 0
    };

    this.setData({
      articles: sampleGuides,
      recommended: sampleGuides.slice(0, 3),
      stats
    });
  },

  /**
   * 设置筛选
   */
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.loadGuides();
  },

  /**
   * 筛选分类
   */
  filterCategory(e) {
    const category = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: category });
    
    if (category === 'all') {
      this.loadGuides();
    } else {
      // 筛选特定分类
      const filtered = this.data.articles.filter(a => a.categoryId === category);
      this.setData({ articles: filtered });
    }
  },

  /**
   * 搜索
   */
  searchGuide() {
    wx.showModal({
      title: '搜索功能',
      content: '搜索功能开发中，敬请期待～',
      showCancel: false
    });
  },

  /**
   * 投稿
   */
  contribute() {
    wx.navigateTo({
      url: '/pages/guide/contribute/contribute'
    });
  },

  /**
   * 查看详情
   */
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/guide/detail/detail?id=' + id
    });
  }
});

// miniprogram/pages/addTemplateDisplay/addTemplateDisplay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 计划动作列表
    planActions: [],
    // 总组数
    TotalGroup: '',
    // 总类型数
    TotalType: '',
    // 各个分类的类别数
    totalArea: '',
    //下拉列表的初始状态
    activeNames: ['1'],
  },

  naviToTraining() {
    wx.navigateTo({
      url: '../Training/Training',
    })
  },
  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  // 获取训练计划
  getPlan() {
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'getTrainPlan',
      success: res => {
        let result = res.result.data[0];
        this.setData({
          planActions: result.planActions,
          TotalGroup: result.TotalGroup,
          TotalType: result.TotalType,
          totalArea: result.totalArea
        })
        console.log('获取到的动作计划', this.data.planActions);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlan();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
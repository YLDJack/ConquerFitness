// pages/TrainTemplate/TrainTemplate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainPlans: [],
    // 操作弹出层
    showPop: false,
    // 添加计划弹出层
    addPlanshow: false,
    // 添加计划中选择动作类型的折叠列表
    collactiveNames: ['0'],
  },
  onCollChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  showPopup() {
    this.setData({
      showPop: true
    });
  },
  addPlan() {
    this.setData({
      addPlanshow: true
    });
  },
  addPlanonClose() {
    this.setData({
      addPlanshow: false
    });
  },
  onClose() {
    this.setData({
      showPop: false
    });
  },

  // 点击模板跳转到traing页面，但是顶部添加备注位置读取了模板宫格中的text
  addTemplate() {
    wx.navigateTo({
      url: '../addTemplateDisplay/addTemplateDisplay',
    })
  },

  templateTraining() {
    wx.navigateTo({
      url: '../addTemplateDisplay/addTemplateDisplay',
    })
  },
  // 点击计划
  clickPlan(event){
    wx.navigateTo({
      url: '../addTemplateDisplay/addTemplateDisplay?planId='+event.currentTarget.dataset.planid,
    })
  },

  // 获取训练计划
  getPlan() {
    // 获取动作计划
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'getTrainPlan',
      success: res => {
        let result = res.result.data;
        this.setData({
          trainPlans: result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPlan();
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
// pages/Training/Training.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 60 * 1000,
    value: 5,
    //下拉列表的初始状态
    activeNames: ['1'],
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    circlevalue: 80
  },
  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  // 添加动作跳转
  addTrain() {
    wx.navigateTo({
      url: '../ActionAdd/ActionAdd',
    })
  },
  //模板训练跳转
  showTem() {
    wx.navigateTo({
      url: '../TrainTemplate/TrainTemplate',
    })
  },
  // // 标签切换函数
  // onTabChange(event) {
  //   if (event.detail === "添加动作") {
  //     console.log(event.detail);
  //     wx.navigateTo({
  //       url: '../Train/Train',
  //     })
  //   } else if (event.detail === "模板训练") {
  //     wx.navigateTo({
  //       url: '../TrainTemplate/TrainTemplate',
  //     })
  //   }
  // },
  // 评价的点击函数
  onChange(event) {
    this.setData({
      value: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
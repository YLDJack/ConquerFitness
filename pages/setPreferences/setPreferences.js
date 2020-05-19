// pages/setPreferences/setPreferences.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    checked_countdown: true,
    checked_weightlbs: true,
    checked_selfnext: true
  },
  
  // 设置倒计时
  onChange_countdown({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked_countdown: detail });
  },
  
  // 设置默认重量单位
  onChange_weightlbs({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked_weightlbs: detail });
  },
  onChange_weightkg({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked_weightkg: detail });
  },

  // 设置自动跳转
  onChange_selfnext({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked_selfnext: detail });
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
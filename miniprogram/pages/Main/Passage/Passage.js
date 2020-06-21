// miniprogram/pages/Main/Passage/Passage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passageId:1,
    passageUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let passageUrl = '';
    switch (options.passageId) {
      case '2':
        passageUrl = 'https://mp.weixin.qq.com/s/sBZoah4WhR0YuMjwCjw-9Q';
        break;

        case '2':
        passageUrl = 'https://mp.weixin.qq.com/s/pyk81myDeX2iR-Vo3utHhw';
        break;
    
      default:
        passageUrl = 'https://mp.weixin.qq.com/s/CtSyKCVTWIwb4WRt1ZYzMQ';
        break;
    }
    this.setData({
      passageId:options.passageId,
      passageUrl:passageUrl
    })
    
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
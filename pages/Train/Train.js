// pages/Train/Train.js'
// import toast from '../../node_modules/@vant/weapp/dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateOption: [
      { text: '按部位', value: 0 },
      { text: '按器材', value: 1 }
    ],
    searchText: "",
    catevalue: 0,
    slideKey: 0,
    imageURL: "http://photocdn.sohu.com/20160305/mp61995258_1457145757198_6.gif",
    showText: false,
  },
  //显示弹出动作详细框
  showPopup() {
    this.setData({ showText: true });
  },

  onClose() {
    this.setData({ showText: false });
  },
  // 侧边栏点击监听事件
  onSlideChange(event) {
    console.log("点击了侧边栏")
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

  },
})
// 导致数据绑定失效，注释掉,
// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 1
//         })
//       }
//     }
//   },
//   options: {
//     styleIsolation: 'shared'
//   }
// })
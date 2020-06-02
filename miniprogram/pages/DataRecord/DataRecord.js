// miniprogram/pages/DataRecord/DataRecord.js
//定义年、月、日的数组都为空
const date = new Date()
const years = []
const months = []
const days = []
// 获取年
for (let i = 1990; i <= date.getFullYear(); i++) {
years.push(i)
}
// 获取月份
for (let i = 1; i <= 12; i++) {
months.push(i)
}
// 获取日期
for (let i = 1; i <= 31; i++) {
days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 日期选择器内容
    showDatePicker:false,
    years,
    year: date.getFullYear(),
    months,
    month: 2,
    days,
    day: 2,
    // value: [9999, 1, 1],
    // tab
    active: 0,
    activeNames: ['0'],
    // 体重下拉面板中数据
    weightcollapse: ['w'],
    weightcircle: 50,
    gradientColor: {
      '0%': 'rgb(63, 236, 255)',
      '100%': 'rgb(132, 114, 248)',
    },
    showweight: false,
    date: "",
    weight: 50,
    // 体脂下拉计算面板
    fatcollapse: ['0'],
    sexvalue: '',
    waistline: '',
    showfattip: false
  },

  onChangeTab(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },

  // 体重下拉面板
  onChangeWeightCard(event) {
    this.setData({
      weightcollapse: event.detail,
    });
  },

  // 改变体重时的调用方法
  onChange_Weight(event) {
    this.setData({
      weight: event.detail
    })
  },
  // 弹出体重选择
  showPopup_weight() {
    this.setData({
      showweight: true
    });
  },
  // 关闭体重选择器
  onClose_weight() {
    this.setData({
      showweight: false
    });
  },

  // 体脂下拉计算面板
  onChangeFatCard(event) {
    this.setData({
      fatcollapse: event.detail,
    });
  },

  onChangeSex(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  onWaistline(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },

  // 体脂范围提示
  showfatpopup() {
    this.setData({ showfattip: true });
  },

  onCloseFattip() {
    this.setData({ showfattip: false });
  },

  // 曲线日历按钮挑战数据图表页面
  onClickLinebtn(){
    wx.navigateTo({
      url: '../Personal_data/Personal_data',
    })
  },

  // 日期选择器弹出层
  showDatePopup() {
    this.setData({ showDatePicker: true });
  },

  onCloseDatePicker() {
    this.setData({ showDatePicker: false });
  },
  
  // 获取改变后的日期
  bindChange(e) {
    const val = e.detail.value
    this.setData({
    year: this.data.years[val[0]],
    month: this.data.months[val[1]],
    day: this.data.days[val[2]]
    })
    },

  // 饮食记录下拉面板
  onChange(event) {
    this.setData({
      activeNames: event.detail,
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
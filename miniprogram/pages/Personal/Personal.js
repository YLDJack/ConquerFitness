import Toast from '@vant/weapp/toast/toast';
//获取应用实例
var app = getApp()
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始化数据
   */
  data: {
    date: "",
    trainState: "增肌",
    height: 170,
    sex: '男',
    tempFilePaths: '',
    nickName: '',
    userInfoAvatar: '',
    showheight: false,
    showsex: false,
    columns: ['增肌', '减脂', '塑形'],
    sexColumns: ['男', '女']
  },
  // 
  onpickerConfirm(event) {
    const {
      value
    } = event.detail;
    this.setData({
      trainState: value,
      showstatu: false
    })
    this.onUpdateCloudData();
  },
  onSexpickerConfirm(event) {
    const {
      value
    } = event.detail;
    this.setData({
      sex:value,
      showstatu: false
    })
    this.onUpdateCloudData();
  },
  onpickerCancel() {
    this.setData({
      showstatu: false
    })
  },
  onSexpickerCancel() {
    this.setData({
      showsex: false
    })
  },
  onChange_height(event) {
    this.setData({
      height: event.detail
    })
  },
  loadbodydatas() {
    let bodydata = app.globalData.bodydata;
    let date = app.globalData.date;
    // 获取性别和每日步数
    let sex = app.globalData.sex;
    let todayStep = app.globalData.todayStep;
    this.setData({
      date: date,
      trainState: bodydata.trainState,
      height: bodydata.height,
      sex: sex,
      todayStep: todayStep
    });
  },
  onLoad: function () {},
  // 更新数据方法
  updateDataToCloud() {
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '更新云端身体数据中...',
      duration: 0,
      loadingType: "circular"
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updatePersonalData',
      // 传给云函数的参数
      data: {
        date: this.data.date,
        trainState: this.data.trainState,
        height: this.data.height,
        sex: this.data.sex,
        todayStep: this.data.todayStep
      },
      success: async res => {
        toast.clear();
        wx.showToast({
          title: '更新成功',
        })
        app.globalData.bodydataChanged = true;
        await app.getDataFromCloud();
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '更新失败',
          icon: "none"
        })
      }
    })
  },
  onChange_collapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  showPopup_sex() {
    this.setData({
      showsex: true
    });
  },
  showPopup_height() {
    this.setData({
      showheight: true
    });
  },
  // 选择锻炼状态
  showPopup_statu() {
    this.setData({
      showstatu: true
    });
  },
  onClose_height() {
    this.setData({
      showheight: false
    });
  },
  onClose_sex() {
    this.setData({
      showsex: false
    });
  },
  // 关闭锻炼状态选择器
  onClose_statu() {
    this.setData({
      showstatu: false
    });
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  onUpdateCloudData() {
    this.updateDataToCloud();
  },

  onCancel() {
    Toast('取消');
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('设置选中项 4')
      this.getTabBar().setData({
        selected: 4
      })
    }
    this.loadbodydatas();

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

  // 分享
  onShareAppMessage: function (e) {
    console.log(e) //点击分享按钮时的一些信息，可以判断分享操作是由右上角菜单触发还是页面button触发
    if (e.from == 'button') {
      let id = e.target.dataset.id; //分享内容的id
      return {
        title: 'xxx',
        path: 'url?id=' + id
      }
    }
  },
})
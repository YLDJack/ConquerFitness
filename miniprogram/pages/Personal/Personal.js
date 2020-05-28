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
    weight: 50,
    fat: 15,
    ass: 50,
    leg: 30,
    smallleg: 20,
    breast: 20,
    arms: 20,
    tempFilePaths: '',
    nickName: '',
    userInfoAvatar: '',
    showhipline: false,
    showweight: false,
    showtizhi: false,
    showlegs: false,
    showstatu: false,
    showbreast: false,
    showarms: false,
    columns: ['增肌', '减脂', '塑形']
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
  onpickerCancel() {
    this.setData({
      showstatu: false
    })
  },
  // 改变体重时的调用方法
  onChange_Weight(event) {
    this.setData({
      weight: event.detail
    })
  },
  onChange_fat(event) {
    this.setData({
      fat: event.detail
    })
  },
  onChange_arms(event) {
    this.setData({
      arms: event.detail
    })
  },
  onChange_breast(event) {
    this.setData({
      breast: event.detail
    })
  },
  onChange_hip(event) {
    this.setData({
      ass: event.detail
    })
  },
  onChange_legs(event) {
    this.setData({
      leg: event.detail
    })
  },
  onChange_smallleg(event) {
    this.setData({
      smallleg: event.detail
    })
  },
  onLoad: function () {
    let bodydata = app.globalData.bodydata;
    let date = app.globalData.date;
    this.setData({
      date: date,
      trainState: bodydata.trainState,
      weight: bodydata.weight,
      fat: bodydata.fat,
      ass: bodydata.ass,
      leg: bodydata.leg,
      smallleg: bodydata.smallleg,
      breast: bodydata.breast,
      arms: bodydata.arms,
    });

  },
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
        weight: this.data.weight,
        fat: this.data.fat,
        ass: this.data.ass,
        leg: this.data.leg,
        smallleg: this.data.smallleg,
        breast: this.data.breast,
        arms: this.data.arms,
      },
      success: res => {
        toast.clear();
        wx.showToast({
          title: '更新成功',
        })
        this.setData({
          cloudexist: true
        });
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
  // 弹出胸围选择
  showPopup_breast() {
    this.setData({
      showbreast: true
    });
  },
  // 弹出臂围选择
  showPopup_arms() {
    this.setData({
      showarms: true
    });
  },
  // 弹出臀围选择
  showPopup_hip() {
    this.setData({
      showhipline: true
    });
  },
  // 弹出体重选择
  showPopup_weight() {
    this.setData({
      showweight: true
    });
  },
  // 弹出体脂选择
  showPopup_tizhi() {
    this.setData({
      showtizhi: true
    });
  },
  // 弹出腿围选择
  showPopup_legs() {
    this.setData({
      showlegs: true
    });
  },
  // 选择锻炼状态
  showPopup_statu() {
    this.setData({
      showstatu: true
    });
  },

  // 关闭臀围选择器
  onClose_hip() {
    this.setData({
      showhipline: false
    });
  },
  // 关闭臀围选择器
  onClose_arms() {
    this.setData({
      showarms: false
    });
  },
  // 关闭臀围选择器
  onClose_breast() {
    this.setData({
      showbreast: false
    });
  },
  // 关闭体重选择器
  onClose_weight() {
    this.setData({
      showweight: false
    });
  },
  // 关闭体脂选择器
  onClose_tizhi() {
    this.setData({
      showtizhi: false
    });
  },
  // 关闭腿围选择器
  onClose_legs() {
    this.setData({
      showlegs: false
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
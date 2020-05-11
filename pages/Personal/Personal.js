import Toast from '@vant/weapp/toast/toast';
//import Toast from 'path/to/@vant/weapp/dist/toast/toast';
//获取应用实例
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始化数据
   */
  data: {
    tempFilePaths: '',
    nickName: '',
    userInfoAvatar: '',
    showhipline: false,
    showweight: false,
    showtizhi: false,
    showlegs: false,
    showstatu: false,
    columns: ['增肌', '减脂', '塑形']
    
  },
  showPopup_hip() {
    this.setData({ showhipline: true });
  },
  showPopup_weight() {
    this.setData({ showweight: true });
  },
  showPopup_tizhi() {
    this.setData({ showtizhi: true });
  },
  showPopup_legs() {
    this.setData({ showlegs: true });
  },
  showPopup_statu() {
    this.setData({ showstatu: true });
  },
  onClose_hip() {
    this.setData({ showhipline: false });
  },
  onClose_weight() {
    this.setData({ showweight: false });
  },
  onClose_tizhi() {
    this.setData({ showtizhi: false });
  },
  onClose_legs() {
    this.setData({ showlegs: false });
  },
  onClose_statu() {
    this.setData({ showstatu: false });
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onCancel() {
    Toast('取消');
  },

  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          userInfoAvatar: res.tempFilePaths
        })
      },
      radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
      },
    })
  },
  onLoad: function () {
    // 获取时间值
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE,
    });

    // 获取个人信息
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // success
        that.setData({
          nickName: res.userInfo.nickName,
          userInfoAvatar: res.userInfo.avatarUrl,
          
        })
      },
      fail: function () {
        // fail
        console.log("获取失败！")
      },
      complete: function () {
        // complete
        console.log("获取用户信息完成！")
    
      }
    })
  },

  //提交表单
  submitForm: function (e) {
    var that = this;
    var title = e.detail.value.title;
    var endtime = this.data.data;
  }
})
// Component({
//   options: {
//     styleIsolation: 'shared'
//   }
// });

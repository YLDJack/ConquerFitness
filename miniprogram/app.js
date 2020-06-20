//app.js
var util = require("/utils/util");
App({
  globalData: {
    bodydata: {},
    bodydatas: [],
    date: util.formatDate(new Date()),
    trainingActions: [],
    trainRecord: [],
    selectActions: [],
    complishTraining: false,
    bodydataChanged:false,
    selectStatus: [],
    sex: '',
    todayStep: 0,
    nickname: '亲'
  },

  // 从云端获取数据的方法
  async getDataFromCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        let length = res.result.data.length;
        wx.showToast({
          title: '获取个人数据成功',
        });
        this.globalData.bodydata = res.result.data[length - 1];
        this.globalData.bodydatas = res.result.data;
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取失败',
          icon: "none"
        })
      }
    })
  },

  onLaunch: function () {
    wx.cloud.init({
      env: "conquercheck-geges",
      traceUser: true,
    });
  },
})
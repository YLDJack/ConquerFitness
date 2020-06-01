//app.js
var util = require("/utils/util");
App({
  globalData: {
    bodydata: {},
    bodydatas: [],
    date: util.formatDate(new Date()),
    trainingActions:[]
  },
  // 将数据添加到云端的方法
  async addDataToCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'addPersonalData',
      // 传给云函数的参数
      data: {
        date: this.globalData.date,
        trainState: "增肌",
        weight: 0,
        fat: 0,
        ass: 0,
        leg: 0,
        smallleg: 0,
        breast: 0,
        arms: 0,
      },
      success: res => {
        wx.showToast({
          title: '上传成功',
        })
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '上传失败',
          icon: "none"
        })
      }
    })
  },
  // 从云端获取数据的方法
  async getDataFromCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        console.log(res.result)
        let length = res.result.data.length;
        if (length === 0) {
          wx.showToast({
            title: '云端不存在数据，将进行同步！',
            icon: "none"
          });
          this.addDataToCloud();
        } else {
          wx.showToast({
            title: '获取个人数据成功',
          });
          this.globalData.bodydata = res.result.data[length - 1];
          this.globalData.bodydatas = res.result.data;
          console.log("身体数据:", this.globalData.bodydata);
          return true;
        }
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
    this.getDataFromCloud();
  }
})
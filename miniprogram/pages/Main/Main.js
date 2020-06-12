// pages/Main/Main.js
import * as echarts from '../../ec-canvas/echarts';
var utils = require('../../utils/util');
var app = getApp();


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    trainStatus: "增肌",
    // 问候语
    hello: "早上好",
    // 当前选中日期
    date: '日期',
    // 日历是否显示
    isCalendarShow: false,
    // 日历显示的最小日期
    minDate: new Date(2020, 0, 1).getTime(),
    toView: 'yellow',
    scrollLeft: 0,
    //滚动的数组
    scrolls: [{
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
      {
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
    ],
    // 日历的日期format方法
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();

      if (month === 5) {
        if (date === 12) {
          day.topInfo = "胸";
          day.bottomInfo = '4786';
          // var info = "<van-tag type='danger' plain >胸</van-tag>";
          // day.bottomInfo = document.write("<van-tag type='danger' plain >胸</van-tag>");
          // var tag = "<van-tag type='danger' plain >胸</van-tag>";
          // day.topInfo = WxParse.wxParse('topInfo', 'html', tag, that);
        }
      }
      return day;
    }
  },



  //日期确认方法
  onConfirm(event) {
    this.setData({
      isCalendarShow: false,
      date: utils.formatDate(event.detail)
    });
  },
  // 显示日历方法
  showCalendar() {
    this.setData({
      isCalendarShow: !this.data.isCalendarShow
    });
    console.log(this.data.isCalendarShow);
  },
  // 右上角转发
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
  //跳转训练界面
  beginTraining() {
    wx.navigateTo({
      url: "../Training/Training",
    })
  },
  showPlan() {
    wx.navigateTo({
      url: "../TrainTemplate/TrainTemplate",
    })
  },
  dataRecord() {
    wx.navigateTo({
      url: "../DataRecord/DataRecord",
    });
  },
  // 从云端获取数据的方法
  async getDataFromCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        wx.showToast({
          title: '获取训练状态成功',
          icon: "none"
        })
        let length = res.result.data.length;
        let status = res.result.data[length - 1].trainState;
        this.setData({
          trainStatus: status
        });
        console.log('状态', this.data.trainStatus);

      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取状态失败',
          icon: "none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getDataFromCloud();
    let date = app.globalData.date
    //获取当前时间和身体数据
    this.setData({
      date: date,
    });
    // 根据当前时间判断早上下午
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) {
      this.setData({
        hello: "凌晨好"
      });
    } else if (hour < 9) {
      this.setData({
        hello: "早上好"
      });
    } else if (hour < 12) {
      this.setData({
        hello: "上午好"
      });
    } else if (hour < 14) {
      this.setData({
        hello: "中午好"
      });
    } else if (hour < 17) {
      this.setData({
        hello: "下午好"
      });
    } else if (hour < 19) {
      this.setData({
        hello: "傍晚好"
      });
    } else if (hour < 22) {
      this.setData({
        hello: "晚上好"
      });
    } else {
      this.setData({
        hello: "夜里好"
      });
    }

    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.werun']) {
          this.getUserInfoandRunData();
        } else {
          this.getUserInfoandRunData();
        }
      }
    })

  },
  getUserInfoandRunData() {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo);
        let sex = res.userInfo.gender;
        if (sex === 1) {
          app.globalData.sex = '男'
        } else {
          app.globalData.sex = '女'
        }
        console.log('性别是', app.globalData.sex);
      }
    })
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    wx.getWeRunData({
      success: res => {
        wx.cloud.callFunction({
          name: 'getWxRunData',
          data: {
            weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
          }
        }).then(resData => {
          app.globalData.todayStep = resData.result.event.weRunData.data.stepInfoList[30].step;
          console.log('今日步数',app.globalData.todayStep) //今天的步数
        })
      }
    })
  },

  scrollToRed: function (e) {
    this.setData({
      toView: 'green'
    })
  },
  scrollTo100: function (e) {
    this.setData({
      scrollLeft: 100
    })
  },

  upper: function (e) {
    console.log('滚动到顶部')
  },
  lower: function (e) {
    console.log('滚动到底部')
  },
  scroll: function (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log('设置选中项 0');
      this.getTabBar().setData({
        selected: 0
      })
    }
  }
})
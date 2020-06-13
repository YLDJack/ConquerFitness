// pages/Main/Main.js
import * as echarts from '../../ec-canvas/echarts';
var utils = require('../../utils/util');
var app = getApp();


Page({
  data: {
    height: '',
    weight: '',
    // 初次设定身体数据的弹出层开关
    SetBody: false,
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
        let length = res.result.data.length;
        if (length === 0) {
          this.setData({
            SetBody: true
          })
        } else {
          wx.showToast({
            title: '获取个人数据成功',
          });
          app.globalData.bodydata = res.result.data[length - 1];
          app.globalData.bodydatas = res.result.data;
          console.log("身体数据:", app.globalData.bodydata);
          let status = res.result.data[length - 1].trainState;
          this.setData({
            trainStatus: status
          });
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
  // 确认设定初始的身体状态，并保存至云端
  onSetBody() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addPersonalData',
      // 传给云函数的参数
      data: {
        date: app.globalData.date,
        trainState: "减脂",
        weight: this.data.weight,
        height: this.data.height,
        fat: 0,
        ass: 0,
        leg: 0,
        smallleg: 0,
        breast: 0,
        arms: 0,
        waist: 0,
        targetWeight: this.data.weight,
        // 目标开始时间
        targetStartTime: app.globalData.date,
        // 目标时间
        targetEndTime: app.globalData.date,
        // 训练目标没有改变，则原始体重也不变
        originWeight: this.data.weight,
        originWeightDate: app.globalData.date,
        sex: app.globalData.sex,
        todayStep: app.globalData.todayStep
      },
      success: res => {
        wx.showToast({
          title: '上传成功',
        }),
        this.setData({
          SetBody:false
        })
        // 添加成功后再去获取数据
        this.getDataFromCloud();
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
  // 关闭初次设置体重的页面
  onCloseSetBody() {
    this.setData({
      SetBody: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getDataFromCloud();
    let date = app.globalData.date
    // 根据当前时间判断早上下午
    const now = new Date();
    const hour = now.getHours();
    let hello = '';
    if (hour < 6) {

      hello = "凌晨好";

    } else if (hour < 9) {

      hello = "早上好";

    } else if (hour < 12) {

      hello = "上午好";

    } else if (hour < 14) {

      hello = "中午好";

    } else if (hour < 17) {

      hello = "下午好";

    } else if (hour < 19) {

      hello = "傍晚好";

    } else if (hour < 22) {

      hello = "晚上好";

    } else {

      hello = "夜里好";

    }
    //获取当前时间和身体数据
    this.setData({
      date: date,
      hello: hello,
    });

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
      success: res => {
        console.log(res.userInfo);
        let sex = res.userInfo.gender;
        if (sex === 1) {
          app.globalData.sex = '男'
        } else {
          app.globalData.sex = '女'
        }
        this.setData({
          nickName: res.userInfo.nickName
        })
        app.globalData.nickName = res.userInfo.nickName;
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
          console.log('今日步数', app.globalData.todayStep) //今天的步数
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
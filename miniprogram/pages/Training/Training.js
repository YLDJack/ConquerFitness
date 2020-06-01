// pages/Training/Training.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour: "00",
    minutes: "00",
    seconds: "00",
    count: 0,
    timer: null,
    value: 5,
    //下拉列表的初始状态
    activeNames: ['1'],
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    circlevalue: 80,
    showClock: false,
    countdowntime: 60 * 1000,
    timeData: {},
    isPause: true,
    isStart: false,
    isGray: true,
    isRed: false
  },

  // 页面顶部正计时处理单个数字
  showNum(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  },
  // 页面顶部正计时点击开始按钮
  onStartClock: function () {
    let timer = this.data.timer;
    console.log(timer);
    if (timer) {
      return false;
    } else {
      timer = setInterval(
        () => {
          var countNew = this.data.count + 1;
          this.setData({
            count: countNew,
            seconds: this.showNum(countNew % 60),
            minutes: this.showNum(parseInt(countNew / 60) % 60),
            hour: this.showNum(parseInt(countNew / 3600))
          })
        }, 1000);
        this.setData({
          timer:timer
        });
    }
  },
  // 顶部暂停按钮
  onPauseClock: function () {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    });
  },
  // 顶部停止按钮
  onStopClock: function () {
    clearInterval(this.data.timer),
      this.setData({
        count: 0,
        seconds: "00",
        minutes: "00",
        hour: "00",
        timer:null
      })
  },

  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // Clock按钮弹出层
  showClockPopup() {
    this.setData({
      showClock: true
    });
  },
  onCloseClock() {
    this.setData({
      showClock: false
    });
  },

  // 倒计时事件
  onChangeClock(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  // clock弹出层中的按钮
  pauseToStart() {
    if (this.data.isPause) {
      this.setData({
        isStart: true,
        isPause: false
      });
    } else if (this.data.isStart) {
      this.setData({
        isStart: false,
        isPause: true,
        isRed: false,
        isGray: true
      });
    }
  },
  stopToReset() {
    if (this.data.isGray) {
      this.setData({
        isGray: false,
        isRed: true
      })
    }
  },

  // 添加动作跳转
  addTrain() {
    wx.navigateTo({
      url: '../ActionAdd/ActionAdd',
    })
  },
  //模板训练跳转
  showTem() {
    wx.navigateTo({
      url: '../TrainTemplate/TrainTemplate',
    })
  },
  // // 标签切换函数
  // onTabChange(event) {
  //   if (event.detail === "添加动作") {
  //     console.log(event.detail);
  //     wx.navigateTo({
  //       url: '../Train/Train',
  //     })
  //   } else if (event.detail === "模板训练") {
  //     wx.navigateTo({
  //       url: '../TrainTemplate/TrainTemplate',
  //     })
  //   }
  // },
  // 评价的点击函数
  onChange(event) {
    this.setData({
      value: event.detail
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
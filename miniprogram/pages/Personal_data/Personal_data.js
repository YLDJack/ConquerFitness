import * as echarts from '../../ec-canvas/echarts';
//初始化折线图的方法
function initlineChart(canvas, width, height, dpr) {

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  const option = {
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['胸部', '背部', '腿部'],
      top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '胸部',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: '背部',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: '腿部',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };

  chart.setOption(option);
  return chart;
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloudexist: true,
    date: "",
    trainState: "增肌",
    weight: 50,
    fat: 15,
    ass: 50,
    leg: 30,
    smallleg: 20,
    breast: 20,
    arms: 20,
  },

  // 从云端获取数据的方法
  getDataFromCloud() {
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '获取身体数据中...',
      duration: 0,
      loadingType: "circular"
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        toast.clear();
        console.log(res.result)
        let length = res.result.data.length;
        if (length === 0) {
          wx.showToast({
            title: '云端不存在数据，将进行同步！',
            icon:"none"
          });
          this.setData({
            cloudexist: false
          });
          this.addDataToCloud();
        } else {
          wx.showToast({
            title: '获取成功',
          });
          this.setData({
            weight: res.result.data[length - 1].weight,
            fat: res.result.data[length - 1].fat,
            ass: res.result.data[length - 1].ass,
            leg: res.result.data[length - 1].leg,
            smallleg: res.result.data[length - 1].smallleg,
            breast: res.result.data[length - 1].breast,
            arms: res.result.data[length - 1].arms,
            cloudexist: true
          });
        }
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '获取失败',
          icon: "none"
        })
      }
    })
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
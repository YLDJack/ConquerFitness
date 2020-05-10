// pages/Count.js
const wxCharts = require('../../utils/wxcharts'); // 引入wx-charts.js文件
var app = getApp();
var pieChart = null;
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //tabs的初始选中状态
    active: 0,
  },
  //获取扇形图表中的索引方法
  pietouchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  // linechart 的点击事件
  linetouchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // 绘制饼图
    pieChart = new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '胸部',
        data: 50,
      }, {
        name: '背部',
        data: 30,
      }, {
        name: '腿部',
        data: 50,
      }, {
        name: '肩部',
        data: 50,
      }, {
        name: '手臂',
        data: 46,
      }],
      width: windowWidth,
      height: 200,
      dataLabel: true
    });

    //绘制折线图
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2021'],

      series: [{
        name: '胸部肌容量',
        data: [5500, 5800, 6000, 6400, 6500, 6600],
      }, {
        name: '背部肌容量',
        data: [6500, 7600, 8000, 8400, 8500, 8600],
      },
      {
        name: '腿部肌容量',
        data: [8000, 9000, 9500, 9800, 10000, 10005],
      },
      {
        name: '手臂肌容量',
        data: [4500, 4800, 5000, 5400, 6500, 6600],
      },
      {
        name: '肩膀肌容量',
        data: [5200, 5900, 6000, 6400, 7500,7600],
      }
    ],
      yAxis: {
        format: function (val) {
          return val;
        }
      },
      width: 320,
      height: 200

    });


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
// ,
// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 2
//         })
//       }
//     }
//   }
// })
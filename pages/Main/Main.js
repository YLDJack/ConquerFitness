// pages/Main/Main.js
var utils = require('../../utils/util')
const wxCharts = require('../../utils/wxcharts'); // 引入wx-charts.js文件
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
var pieChart = null;
var lineChart = null;

Page({
  data: {
    pieImg: [],
    lineImg: [],
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
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();

      if (month === 5) {
        if (date === 12) {
          day.topInfo = "胸";
          day.bottomInfo = '4786';
          // var info = "<van-tag type='danger' plain >胸</van-tag>";
          // day.bottomInfo = document.write("<van-tag type='danger' plain >胸</van-tag>");

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
  //跳转训练界面
  beginTraining() {
    wx.navigateTo({
      url: "../Training/Training",
    })
  },
  // 将canvas转换为图片
  handleCanvarToImg(that) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 260,
      height: 550,
      canvasId: 'pieCanvas',
      success: function (res) {
        that.setData({
          pieImg: res.tempFilePath
        });
      }
    });
  },
  // 将canvas转换为图片
  handleCanvarToImg1(that) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 260,
      height: 550,
      canvasId: 'lineCanvas',
      success: function (res) {
        that.setData({
          lineImg: res.tempFilePath
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentdate = utils.formatDate(new Date());
    console.log(currentdate);
    this.setData({
      date: currentdate
    });
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
          data: [5200, 5900, 6000, 6400, 7500, 7600],
        }
      ],
      yAxis: {
        format: function (val) {
          return val;
        }
      },
      width: 320,
      height: 200,
    });


  },
  onClick() {
    wx.navigateTo({
      url: '../TrainTemplate/TrainTemplate',
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
})

// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 1
//         })
//       }
//     }
//   },
//   options: {
//     styleIsolation: 'shared'
//   }
// })
// pages/Train/Train.js'
// import toast from '../../node_modules/@vant/weapp/dist/toast/toast';
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

//初始化折线图的方法
function initlineChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
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
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateOption: [{
        text: '按部位',
        value: 0
      },
      {
        text: '按器材',
        value: 1
      }
    ],
    starvalue: 3,
    searchText: "",
    catevalue: 0,
    slideKey: 0,
    imageURL: "http://photocdn.sohu.com/20160305/mp61995258_1457145757198_6.gif",
    //展示动作界面
    showText: false,
    //展示添加动作界面
    showAddPop: false,
    // 添加动作界面弹出层coll默认选中数值
    collactiveNames: ['0'],
    collactiveNames1: ['1'],
    lineec: {
      onInit: initlineChart
    }
  },
  // 添加动作跳转事件
  showAdd() {
    this.setData({
      showAddPop: true
    });
  },
  onAddClose() {
    this.setData({
      showAddPop: false
    });
  },
  onCollChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  onCollChange1(event) {
    this.setData({
      collactiveNames1: event.detail
    });
  },
  //星星评分的点击事件
  onStarChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  //显示弹出动作详细框
  showPopup() {
    this.setData({
      showText: true
    });
  },

  onClose() {
    this.setData({
      showText: false
    });
  },
  // 侧边栏点击监听事件
  onSlideChange(event) {
    console.log("点击了侧边栏")
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

  },
})
// 导致数据绑定失效，注释掉,
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
// pages/Count.js
import * as echarts from '../../ec-canvas/echarts';
import Toast from '@vant/weapp/toast/toast';
// 由于utils里zh-cn的依赖不对，所以要去源码里修改
require('../../utils/dayjs/locale/zh-cn');
import dayjs from '../../utils/dayjs/index';
import weekday from '../../utils/dayjs/plugin/weekday/index';
import weekOfYear from '../../utils/dayjs/plugin/weekOfYear/index';

// dayjs时间周期处理工具
dayjs.locale('zh-cn');
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pieec: {
      lazyLoad: true, // 延迟加载
    },
    //echarts饼图的数据列表
    pieSeries: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['40%', '60%'],
      // 文字标签显示
      label: {
        show: true, //开启显示
        position: 'top', //在上方显示
        formatter: '{b}\n{c}', //显示数值和百分比
        fontSize: 14,
        align: 'center',
        verticalAlign: 'center'
      },
      // 获取的数据
      data: []
    }],
    //tabs的初始选中状态
    active: 0,
    // coll初始选中状态
    activeNames: ['1'],
    trainRecord: []
  },
  //跳转动作详情页面
  showDesc() {
    wx.navigateTo({
      url: "../ActionDesc/ActionDesc",
    })
  },
  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色为亮色
      const Chart = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取环形图eharts设置数据
  getOption: function () {
    var option = {
      backgroundColor: "#ffffff",
      series: this.data.pieSeries,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10
      },
    };
    return option
  },
  // 获取环形图数据
  getChartData: function () {
    // 获取本周的训练记录
    let dayArray = [];
    let weekNumArray = [];
    let areas = new Set();
    let pieSeries = this.data.pieSeries;
    let data = [];
    // 获取本周的时间
    for (let i = 1; i < 8; i++) {
      dayArray.push(dayjs().day(i).format('YYYY-MM-DD'));
      weekNumArray.push(dayjs().day(i).format('dddd'))
    }
    console.log('日期数', dayArray);
    console.log('星期数', weekNumArray);

   
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTotalAreaByDates',
      // 传给云函数的参数
      data: {
        dayArray: dayArray
      },
      success: res => {
        wx.showToast({
          title: '获取图表数据成功',
        })
        let result = res.result.data;
        console.log('result', result);
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].totalArea.length; j++) {
            areas.add(result[i].totalArea[j].area);
          }
        }
        areas = Array.from(areas);
        console.log('绘图的areas', areas);
        // 获取所有的部位
        for (let i = 0; i < areas.length; i++) {
          data.push({
            name: areas[i],
            value: 0
          });
          // 获取部位的计数
          for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].totalArea.length; k++) {
              if (data[i].name === result[j].totalArea[k].area) {
                data[i].value += result[j].totalArea[k].areaCount;
              }
            }
          }
        }

        pieSeries[0].data = data;
        this.setData({
          pieSeries: pieSeries
        })
        console.log('绘图的data', this.data.pieSeries[0].data);
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取图表数据失败',
          icon: "none"
        })
      }
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('选中页面 3')
      this.getTabBar().setData({
        selected: 3
      })
    }
    this.getChartData();
    // 此处要与标签的id一致不是canvasid
    this.echartsComponnet = this.selectComponent('#mychart-dom-pie');
    this.init_echarts()
  },

  // 获取训练记录渲染下方的下拉列表
  loadTrainedRecords() {
    // 获取本周的训练记录
    let dayArray = [];
    let weekNumArray = [];
    let areas = new Set();
    let pieSeries = this.data.pieSeries;
    let data = [];
    // 获取本周的时间
    for (let i = 1; i < 8; i++) {
      dayArray.push(dayjs().day(i).format('YYYY-MM-DD'));
      weekNumArray.push(dayjs().day(i).format('dddd'))
    }
    console.log('日期数', dayArray);
    console.log('星期数', weekNumArray);

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTrainedRecordByDates',
      // 传给云函数的参数
      data: {
        dayArray: dayArray
      },
      success: res => {
        wx.showToast({
          title: '获取图表数据成功',
        })
       
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取图表数据失败',
          icon: "none"
        })
      }
    });
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
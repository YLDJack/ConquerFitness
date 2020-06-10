var app = getApp();
import * as echarts from '../../ec-canvas/echarts';
// pages/ActionDesc/ActionDesc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询的动作id
    actionId: 0,
    actionName: '',
    lineec: {
      lazyLoad: true, // 延迟加载
    },
    lineec1: {
      lazyLoad: true, // 延迟加载
    },
    // 肌容量图数据
    countSeries: [{
      data: [],
      smooth: false,
      // 圆圈的大小
      symbol: 'circle',
      symbolSize: 10,
      type: 'line',
      // 设置始终显示数据
      itemStyle: {
        normal: {
          label: {
            color: 'lightred',
            // 设置单位
            show: true, //开启显示
            position: 'top', //在上方显示
          }
        }
      },
      // 显示最大值最小值以及平均值
      markPoint: {
        data: [{
            type: 'max',
            name: '最大值',
            symbolSize: 40,

          },
          {
            type: 'min',
            name: '最小值',
            symbolSize: 40
          }
        ]
      },
      // 设置平均值的线
      markLine: {
        label: {
          show: true,
          position: 'end'
        },
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    },],
    // 肌容量坐标x轴
    countAscissaData: [],
    // 肌容量图数据
    maxSeries: [{
      data: [],
      smooth: false,
      // 圆圈的大小
      symbol: 'circle',
      symbolSize: 10,
      type: 'line',
      // 设置始终显示数据
      itemStyle: {
        normal: {
          label: {
            // 设置单位
            formatter: '{c}Kg',
            color: 'lightred',
            // 设置单位
            show: true, //开启显示
            position: 'top', //在上方显示
          }
        }
      },
      // 显示最大值最小值以及平均值
      markPoint: {
        data: [{
            type: 'max',
            name: '最大值',
            symbolSize: 40,

          },
          {
            type: 'min',
            name: '最小值',
            symbolSize: 40
          }
        ]
      },
      // 设置平均值的线
      markLine: {
        label: {
          show: true,
          position: 'end'
        },
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    },],
    // 肌容量坐标x轴
    maxAscissaData: []
  },
  // tab的切换方法
  onTabChange(event) {
    console.log('tab', event.detail.name);
    if (event.detail.name === 1) {
      this.getMaxWeightChartData();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      actionName: options.actionName,
      actionId: options.actionId
    });
  },
  //初始化容量图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取容量eharts设置数据
  getOption: function () {
    var that = this
    var option = {
      legend: {
        data: ['肌容量'],
        bottom: 0,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      // 刻度
      grid: {
        containLabel: true
      },
      dataZoom: [{
        type: 'inside',
        throttle: 50
      }],
      // 指定表的标题
      title: {
        show: true,
        text: '容量变化折线图',
        left: 'center',
      },
      xAxis: {
        //坐标轴名字 name:'日期',
        // nameLocation:'center',
        type: 'category',
        boundaryGap: false,
        data: that.data.countAscissaData.reverse(),
        onZero: true,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: { //y轴坐标是否显示
          show: true
        },
        axisTick: { //y轴刻度小标是否显示
          show: true
        }
      },
      series: that.data.countSeries
    }
    return option
  },
  // 获取容量折线图数据
  getChartData: function () {
    let countSeries = this.data.countSeries;
    // 处理好的横坐标
    let countAscissaData = [];
    let actionId = this.data.actionId;
    // 根据动作id和open_id获取动作记录数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getActionRecordById',
      // 传给云函数的参数
      data: {
        actionId: actionId
      },
      success: res => {
        wx.showToast({
          title: '获取动作数据成功',
        })
        let result = res.result.data

        // 容量的数值
        let ydata = [];

        //将动作记录的时间设置为x轴
        for (let i = 0; i < result.length; i++) {
          ydata.push(result[i].trainCount);
          countAscissaData.push(result[i].date);
        }
        countSeries[0].data = ydata.reverse();
        this.setData({
          countSeries: countSeries,
          countAscissaData: countAscissaData
        });
        console.log('获取到的动作记录', this.data.countAscissaData);
        this.echartsComponnet = this.selectComponent('#mycountlinechart');
        this.init_echarts();
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取动作数据失败',
          icon: "none"
        })
      }
    });
  },
  //初始化图表
  init_maxWeightecharts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getMaxWeightOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取eharts设置数据
  getMaxWeightOption: function () {
    var that = this
    var option = {
      legend: {
        data: ['最大重量'],
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      // 刻度
      grid: {
        containLabel: true
      },
      dataZoom: [{
        type: 'inside',
        throttle: 20
      }],
      // 指定表的标题
      title: {
        show: true,
        text: '最大重量变化折线图',
        left: 'center',
      },
      xAxis: {
        //坐标轴名字 name:'日期',
        // nameLocation:'center',
        type: 'category',
        boundaryGap: false,
        data: that.data.maxAscissaData.reverse(),
        onZero: true,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: { //y轴坐标是否显示
          show: true
        },
        axisTick: { //y轴刻度小标是否显示
          show: true
        }
      },
      series: that.data.maxSeries
    }
    return option
  },
  // 获取折线图数据
  getMaxWeightChartData: function () {
    let maxSeries = this.data.maxSeries;
    // 处理好的横坐标
    let maxAscissaData = [];
    let actionId = this.data.actionId;
    // 根据动作id和open_id获取动作记录数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getActionRecordById',
      // 传给云函数的参数
      data: {
        actionId: actionId
      },
      success: res => {
        wx.showToast({
          title: '获取动作数据成功',
        })
        let result = res.result.data

        // 容量的数值
        let ydata = [];

        //将动作记录的时间设置为x轴
        for (let i = 0; i < result.length; i++) {
          ydata.push(result[i].maxWeight);
          maxAscissaData.push(result[i].date);
        }
        maxSeries[0].data = ydata.reverse();
        this.setData({
          maxSeries: maxSeries,
          maxAscissaData: maxAscissaData
        });
        console.log('获取到的最大重量记录', this.data.maxSeries);
        this.echartsComponnet = this.selectComponent('#mymaxweightlinechart');
        this.init_maxWeightecharts();
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取动作数据失败',
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
  onShow: function (options) {
    this.getChartData();
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
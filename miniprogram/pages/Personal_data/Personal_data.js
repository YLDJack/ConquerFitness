import * as echarts from '../../ec-canvas/echarts';
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认数据
    date01: '2019-6-1',
    date02: '2019-6-7',
    // 原本默认的坐标轴数据
    series: [{
        data: ([34, 66, 45, 59, 37, 85, 60]).reverse(),
        name: '体重',
        smooth: false,
        type: 'line'
      }, {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '体脂',
        smooth: false,
        type: 'line'
      },
      {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '臂围',
        smooth: false,
        type: 'line'
      },
      {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '胸围',
        smooth: false,
        type: 'line'
      },
      {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '臀围',
        smooth: false,
        type: 'line'
      },
      {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '大腿',
        smooth: false,
        type: 'line'
      },
      {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '小腿',
        smooth: false,
        type: 'line'
      }
    ],
    // 默认7天
    ascissaData: (['6-1', '6-2', '6-3', '6-4', '6-5', '6-6', '6-7']).reverse(),
    bodydatas: [],
    lineec: {
      lazyLoad: true, // 延迟加载
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bodydatas: app.globalData.bodydatas
    })
    console.log("获取到的身体数据", this.data.bodydatas);
    this.getChartData();
    // 此处要与标签的id一致不是canvasid
    this.echartsComponnet = this.selectComponent('#mylinechart');
    this.init_echarts()
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表
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
  // 获取eharts设置数据
  getOption: function () {
    var that = this
    console.log(that.data.series)
    console.log(that.data.ascissaData)
    var legendList = []
    for (var i in that.data.series) {
      var obj = {
        name: that.data.series[i].name,
        icon: 'circle',
        textStyle: {
          color: '#000000',
        }
      }
      legendList.push(obj)

      that.data.series[i].data.reverse()
    }
    var option = {
      // 折线图线条的颜色
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // 折线图的线条代表意义
      legend: {
        itemWidth: 5, //小圆点的宽度
        itemGap: 25,
        selectedModel: 'single', //折线可多选
        inactiveColor: '#87CEEB',
        data: legendList,
        bottom: 0,
        left: 30,
        z: 100
      },
      // 刻度
      grid: {
        containLabel: true
      },
      // 悬浮图标
      tooltip: {
        show: true,
        trigger: 'axis',
        position: function (pos, params, dom, rect, size) {
          var obj = {
            top: 60
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: that.data.ascissaData.reverse(),
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
          show: false
        },
        axisTick: { //y轴刻度小标是否显示
          show: false
        }
      },
      series: that.data.series
    }
    return option
  },
  // 获取折线图数据
  getChartData: function () {
    let bodydatas = this.data.bodydatas;
    // 处理好的横坐标
    let ascissaData = [];
    // 处理好的整体数据
    let series = this.data.series;
    // 横坐标为bodydatas中存在的数据
    let length = bodydatas.length;
    // 获取各项数据的数组
    let weight = this.addtoArray("weight");
    let fat = this.addtoArray("fat");
    let ass = this.addtoArray("ass");
    let leg = this.addtoArray("leg");
    let smallleg = this.addtoArray("smallleg");
    let breast = this.addtoArray("breast");
    let arms = this.addtoArray("arms");
    let data = {};
    data[0] = weight;
    data[1] = fat;
    data[2] = ass;
    data[3] = leg;
    data[4] = smallleg;
    data[5] = breast;
    data[6] = arms;




    for (let i = 0; i < series.length; i++) {
      series[i].data = data[i];
    }
    for (let i = 0; i < length; i++) {
      ascissaData.push(bodydatas[i].date);
    }
    this.setData({
      series: series,
      ascissaData: ascissaData
    });
  },
  // 将身体数据中的每个属性都包装成数组
  addtoArray(item) {
    let bodydatas = this.data.bodydatas;
    let length = this.data.bodydatas.length;
    let res = [];
    for(let i =0;i<length;i++){
      res.push(bodydatas[i][item]);
    }
    console.log(res);
    return res;
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
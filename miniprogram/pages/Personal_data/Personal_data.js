import * as echarts from '../../ec-canvas/echarts';
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认数据
    showchart: true,
    // 原本默认的坐标轴数据
    series: [{
        data: [],
        name: '体重',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}Kg',
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
      },
      {
        data: [],
        name: '体脂',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}%',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        },
      },
      {
        data: [],
        name: '臂围',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}cm',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        },
      },
      {
        data: [],
        name: '胸围',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}cm',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        }
      },
      {
        data: [],
        name: '臀围',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}cm',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        }
      },
      {
        data: [],
        name: '大腿',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}cm',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        }
      },
      {
        data: [],
        name: '小腿',
        smooth: false,
        type: 'line',
        // 设置始终显示数据
        itemStyle: {
          normal: {
            label: {
              // 设置单位
              formatter: '{c}cm',
              show: true, //开启显示
              position: 'top', //在上方显示
            }
          }
        }
      }
    ],
    // 坐标x轴
    ascissaData: [],
    bodydatas: [],
    lineec: {
      lazyLoad: true, // 延迟加载
    },
  },

  // tab的切换方法
  onTabChange(event) {
    console.log('tab', event.detail.title);
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
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
      // 初始化图表,init中的第二个参数可以设置主题颜色
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
  // 获取eharts设置数据
  getOption: function () {
    var that = this
    var legendList = []
    // 将名称放入下方图例中
    for (var i in that.data.series) {
      var obj = {
        name: that.data.series[i].name,
        icon: 'circle',
        textStyle: {
          color: '#000000',
        },
      }
      legendList.push(obj)

      that.data.series[i].data.reverse()
    }
    var option = {
      // 下方的图例折线图的线条代表意义
      legend: {
        itemWidth: 20, //小圆点的宽度
        // itemGap: 25,
        selectedModel: 'single', //折线可多选
        inactiveColor: '#ccc', //图例关闭时的颜色
        data: legendList,
        selected: {
          // 默认显示体重和体脂
          '体重': true,
          '体脂': true,
          '臂围':false,
          '胸围':false,
          '臀围':false,
          '大腿':false,
          '小腿':false,
        },
        bottom: 0,
        // left: 30,
        z: 100
      },
      // 刻度
      grid: {
        containLabel: true,

      },
      // 指定表的标题
      title: {
        show: true,
        text: '身体数据折线图',
        left: 'center',
        subtext: '点击相应的图例可以隐藏数据'
      },
      // 悬浮图标
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        position: function (pos, params, dom, rect, size) {
          var obj = {
            top: 60
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        }
      },
      xAxis: {
        //坐标轴名字 name:'日期',
        // nameLocation:'center',
        type: 'category',
        boundaryGap: false,
        data: that.data.ascissaData.reverse(),
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
      series: that.data.series
    }
    return option
  },
  // 获取折线图数据
  getChartData: function () {
    this.setData({
      bodydatas: app.globalData.bodydatas
    })
    let bodydatas = this.data.bodydatas;
    console.log('获取到的身体数据:', bodydatas);
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
    data[2] = arms;
    data[3] = breast;
    data[4] = ass;
    data[5] = leg;
    data[6] = smallleg;

    // 将各项身体指标设置为y轴，并进行reverse。才能从小到大排序
    for (let i = 0; i < series.length; i++) {
      series[i].data = data[i].reverse();
    }
    //将身体数据的时间设置为x轴
    for (let i = 0; i < length; i++) {
      ascissaData.push(bodydatas[i].date);
    }
    this.setData({
      series: series,
      ascissaData: ascissaData.reverse()
    });
  },
  // 将身体数据中的每个属性都包装成数组
  addtoArray(item) {
    let bodydatas = this.data.bodydatas;
    let length = this.data.bodydatas.length;
    let res = [];
    for (let i = 0; i < length; i++) {
      res.push(bodydatas[i][item]);
    }
    console.log('' + item, res);
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
    this.getChartData();
    // 此处要与标签的id一致不是canvasid
    this.echartsComponnet = this.selectComponent('#mylinechart');
    this.init_echarts()
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
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
// 根据本地化配置获取星期几
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 年份数组
    yearArray: [],
    // 月份数组
    monthArray: [],
    // 星期数组
    weekArray: [],
    // 没有训练数据时的提示
    nullInfo: '',
    // 获取的训练记录
    trainRecord: [],
    pieec: {
      lazyLoad: true, // 延迟加载
    },
    lineec: {
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
    //训练量数据
    countSeries: [{
      data: [],
      name: '',
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
    }, ],
    //训练量坐标x轴
    countAscissaData: [],
    //tabs的初始选中状态
    active: 0,
    // coll初始选中状态
    activeNames: [],
    trainRecord: [],
    trainingDays: 0
  },
  //跳转动作详情页面
  showDesc(event) {
    let actionId = event.currentTarget.dataset.actionid;
    let actionName = event.currentTarget.dataset.actionname;
    console.log('点击的id', actionName);
    wx.navigateTo({
      url: "../ActionDesc/ActionDesc?actionId=" + actionId + "&actionName=" + actionName,
    })
  },
  // 下拉菜单的点击事件
  onCollChange(event) {
    console.log(event.detail);
    this.setData({
      activeNames: event.detail
    });
  },
  // tab的切换方法
  onTabChange(event) {
    console.log('tab', event.detail.title);
    // 获取当本周开始时间，0代表星期一
    let startDate = dayjs().weekday(0).format('YYYY-MM-DD');
    // 获取当前一周的结束日期
    let endDate = dayjs().weekday(6).format('YYYY-MM-DD');
    this.initWeek();
    if (event.detail.name === 1) {
      this.getCountChartData(startDate, endDate);
    }
  },
  // 时间tab的切换方法，更改tabs的显示时间
  onTimeTabChange(event) {
    if (event.detail.name === 0) {
      this.initWeek();
    } else if (event.detail.name === 1) {
      this.initMonth();
    } else {
      this.initYear();
    }
  },
  // 周card的切换方法:根据选择不同的周，来传递不同的startDate和EndDate来获取图表数据
  onWeekTabChange(event) {
    // 获取当本周开始时间，0代表星期一
    let startDate = '';
    // 获取当前一周的结束日期
    let endDate = '';
    // 获取当前是第几周
    let timeStap = event.detail.title;
    // 获取当前周数=星期数组中第三个数据加2，因为第一第二周是文字，所以要获取第三周
    let thisWeek = this.data.weekArray[2] + 2;
    if (timeStap === "本周") {
      // 获取本周开始时间，0代表星期一
      startDate = dayjs().weekday(0).format('YYYY-MM-DD');
      // 获取当前一周的结束日期
      endDate = dayjs().weekday(6).format('YYYY-MM-DD');
      this.getChartData(startDate, endDate, 0);
      this.loadTrainedRecords(startDate, endDate);
    } else if (timeStap === "上周") {
      // 获取当本周开始时间，0代表星期一
      startDate = dayjs().weekday(-7).format('YYYY-MM-DD');
      // 获取当前一周的结束日期
      endDate = dayjs().weekday(-1).format('YYYY-MM-DD');
      this.getChartData(startDate, endDate, 1);
      this.loadTrainedRecords(startDate, endDate);
    } else {
      // 获取周数和本周的差值
      let weekChange = thisWeek - timeStap;
      // 获取当本周开始时间，0代表星期一
      startDate = dayjs().weekday(0-7*weekChange).format('YYYY-MM-DD');
      // 获取当前一周的结束日期
      endDate = dayjs().weekday(6-7*weekChange).format('YYYY-MM-DD');
      this.getChartData(startDate, endDate, 1);
      this.loadTrainedRecords(startDate, endDate);
    }
  },
  // 初始化周数组
  initWeek() {
    // 初始化周的数组
    let thisWeek = dayjs().week();
    let weekArray = this.data.weekArray;
    for (let i = thisWeek; i > 0; i--) {
      if (i === thisWeek) {
        weekArray.push('本周');
        continue;
      } else if (i === thisWeek - 1) {
        weekArray.push('上周');
        continue;
      }
      weekArray.push(i)
    };
    this.setData({
      weekArray: weekArray
    });
  },
  // 初始化月数组
  initMonth() {
    // 初始化月的数组
    let thismonth = dayjs().month();
    let monthArray = this.data.monthArray;
    for (let i = thismonth; i >= 0; i--) {
      if (i === thismonth) {
        monthArray.push('本月');
        continue;
      }
      // 月份是从0开始计数的
      monthArray.push(i + 1 + '月');
    };
    this.setData({
      monthArray: monthArray
    });
  },
  // 初始化年数组
  initYear() {
    let thisyear = dayjs().year();
    let yearArray = this.data.yearArray;
    for (let i = thisyear; i >= 2018; i--) {
      if (i === thisyear) {
        yearArray.push('今年');
        continue;
      }
      yearArray.push(i);
    };
    this.setData({
      yearArray: yearArray
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当本周开始时间，0代表星期一
    let startDate = dayjs().weekday(0).format('YYYY-MM-DD');
    // 获取当前一周的结束日期
    let endDate = dayjs().weekday(6).format('YYYY-MM-DD');
    this.initWeek();
    this.getChartData(startDate, endDate, 0);
    this.loadTrainedRecords(startDate, endDate);
  },
  //初始化环形图图表
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
      // 添加图标点击事件
      Chart.on('mousedown', function (e) {
        console.log('图表点击事件', e.data.name);
        wx.navigateTo({
          url: e.data.url + '?area=' + e.data.name,
        })
      })
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
        type: 'scroll',
        orient: 'vertical',
        right: 5,
        itemWidth: 5, //小圆点的宽度
        icon: 'rect'
      },
      title: {
        show: true,
        text: '本周训练' + this.data.trainingDays + '次',
        subtext: '点击部位查看详情',
        size: 12
      }
    };
    return option
  },
  // 获取环形图数据
  getChartData: async function (startDate, endDate, timeStap) {

    let areas = new Set();
    let pieSeries = this.data.pieSeries;
    let data = [];

    console.log('当周的最后一天', endDate);


    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getTotalAreaByDates',
      // 传给云函数的参数
      data: {
        startDate: startDate,
        endDate: endDate
      },
      success: res => {
        wx.showToast({
          title: '获取图表数据成功',
        })
        // 处理获取来的数据
        let result = res.result.data;
        console.log('获取到训练记录data', result);
        // 如果获取到的结果为空，则直接返回并设置提示文字
        if (result.length === 0) {
          this.setData({
            nullInfo: '没有任何记录！'
          });
          return false;
        }
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].totalArea.length; j++) {
            areas.add(result[i].totalArea[j].area);
          }
        }
        areas = Array.from(areas);

        // 获取所有的部位
        for (let i = 0; i < areas.length; i++) {
          data.push({
            name: areas[i],
            value: 0,
            url: '../ActionDetial/ActionDetial'
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
          nullInfo: '', // 如果不为空，将提示文字清空
          pieSeries: pieSeries
        })
        console.log('绘图的data', this.data.pieSeries[0].data);
        // 此处要与标签的id一致不是canvasid
        let id = 'mychart-dom-pie' + timeStap;
        console.log('class名', id);
        this.echartsComponnet = this.selectComponent('.' + id);
        console.log('echarts组件', this.echartsComponnet);
        this.init_echarts();
        // 获取下拉列表的数据
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
  //初始化容量图表
  init_Countecharts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色
      const Chart = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getCountOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取容量eharts设置数据
  getCountOption: function () {
    var that = this;
    var legendList = []
    // 将名称放入下方图例中
    for (var i in that.data.countSeries) {
      var obj = {
        name: that.data.countSeries[i].name,
        icon: 'rect',
        textStyle: {
          color: '#000000',
        }
      }
      legendList.push(obj);

      that.data.countSeries[i].data.reverse();
    }
    var option = {
      // 下方的图例折线图的线条代表意义
      legend: {
        itemWidth: 5, //小矩形的宽度
        // itemGap: 25,
        selectedModel: 'single', //折线可多选
        inactiveColor: '#ccc', //图例关闭时的颜色
        data: legendList,
        bottom: 20,
        // left: 30,
        z: 100
      },
      // 指定表的标题
      title: {
        show: true,
        text: '肌容量折线图',
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
        data: that.data.countAscissaData,
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
  getCountChartData: function (startDate, endDate) {
    // 获取本周的训练记录
    let areas = new Set();
    let data = [];
    let countSeries = [];
    // 处理好的横坐标
    let countAscissaData = [];

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTotalAreaByDates',
      // 传给云函数的参数
      data: {
        startDate: startDate,
        endDate: endDate
      },
      success: res => {
        wx.showToast({
          title: '获取肌容量数据成功',
        })
        // 处理获取来的数据
        let result = res.result.data;
        console.log('获取到data', result);
        // 获取数据中的部位
        for (let i = 0; i < result.length; i++) {
          // 将日期作为横坐标
          countAscissaData.push(result[i].date);
          for (let j = 0; j < result[i].totalArea.length; j++) {
            areas.add(result[i].totalArea[j].area);

          }
        }
        areas = Array.from(areas);
        // 获取所有的部位
        for (let i = 0; i < areas.length; i++) {
          data.push({
            name: areas[i],
            value: []
          });
          // 获取部位的计数
          for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].totalArea.length; k++) {
              // 如果部位相同，则将其放入相应部位的value计数中
              if (data[i].name === result[j].totalArea[k].area) {
                data[i].value.push(result[j].totalArea[k].areaCount);
              }
            }
          }
        }
        console.log('折线图中处理好的data', data);

        for (let j = 0; j < data.length; j++) {
          countSeries[j] = {
            data: [],
            name: '',
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

          }
          countSeries[j].name = data[j].name;
          countSeries[j].data = data[j].value;
        }

        console.log('折线图中处理好的data', countSeries);


        this.setData({
          countSeries: countSeries,
          countAscissaData: countAscissaData
        });
        console.log('获取到的动作记录', this.data.countAscissaData);
        this.echartsComponnet = this.selectComponent('#mychart-dom-line');
        this.init_Countecharts();
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取肌容量数据失败',
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
    // 获取当本周开始时间，0代表星期一
    let startDate = dayjs().weekday(0).format('YYYY-MM-DD');
    // 获取当前一周的结束日期
    let endDate = dayjs().weekday(6).format('YYYY-MM-DD');
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('选中页面 3')
      this.getTabBar().setData({
        selected: 3
      })
    }
    // 不用每次显示页面都重新加载，应当在完成动作之后再进行重新加载
    if (app.globalData.complishTraining) {
      app.globalData.complishTraining = false;
      this.getChartData(startDate, endDate, 0);
      this.loadTrainedRecords(startDate, endDate);

    }
  },

  // 获取训练记录渲染下方的下拉列表
  async loadTrainedRecords(startDate, endDate) {
    let areas = new Set();
    let classifiedTrainRecord = [];
    let trainRecord = [];

    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getTrainedRecordByDates',
      // 传给云函数的参数
      data: {
        startDate: startDate,
        endDate: endDate
      },
      success: res => {

        wx.showToast({
          title: '获取训练记录成功',
        })
        let result = res.result.data;
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].trainRecord.length; j++) {
            areas.add(result[i].trainRecord[j].actionArea);
            trainRecord.push(result[i].trainRecord[j]);
          }
        }
        areas = Array.from(areas);

        for (let i = 0; i < areas.length; i++) {
          //  初始化分类好的数组
          let record = {
            area: areas[i],
            trainRecord: []
          };
          classifiedTrainRecord.push(record);
        }
        //  遍历分类好的数组和训练记录，如果训练记录的area和classifiedTrainRecord的area相等，则将其的动作记录放入到其中
        for (let j = 0; j < classifiedTrainRecord.length; j++) {
          for (let i = 0; i < trainRecord.length; i++) {
            if (trainRecord[i].actionArea === classifiedTrainRecord[j].area) {
              classifiedTrainRecord[j].trainRecord.push(trainRecord[i]);
            }
          }
        }

        // 合并两个相同的动作
        for (let i = 0; i < classifiedTrainRecord.length; i++) {
          for (let j = 0; j < classifiedTrainRecord[i].trainRecord.length - 1; j++) {
            if (classifiedTrainRecord[i].trainRecord[j]._id === classifiedTrainRecord[i].trainRecord[j + 1]._id) {
              classifiedTrainRecord[i].trainRecord[j].date = classifiedTrainRecord[i].trainRecord[j].date + ' ' + classifiedTrainRecord[i].trainRecord[j + 1].date;
              classifiedTrainRecord[i].trainRecord[j].trainComplishCount += classifiedTrainRecord[i].trainRecord[j + 1].trainComplishCount;
              classifiedTrainRecord[i].trainRecord.splice(j + 1, 1);
            }

          }

        }

        console.log('训练记录中的总部位', classifiedTrainRecord);
        this.setData({
          trainingDays: result.length,
          trainRecord: classifiedTrainRecord
        });
      },
      fail: error => {

        console.log(error);
        wx.showToast({
          title: '获取训练记录失败',
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
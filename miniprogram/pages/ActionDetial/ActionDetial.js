// miniprogram/pages/ActionDetial/ActionDetial.js
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
    area: '胸部',
    pieec: {
      lazyLoad: true, // 延迟加载
    },
    //echarts饼图的数据列表
    pieDataset: [],
    pieSeries: [],
    // coll初始选中状态
    activeNames: [],
    // 按训练侧重分布的动作记录
    trainRecord: []
  },

  // 下拉菜单的点击事件
  onCollChange(event) {
    console.log(event.detail);
    this.setData({
      activeNames: event.detail
    });
  },

  // 获取训练记录渲染下方的下拉列表
  loadTrainedRecords() {
    // 获取本周的训练记录
    let dayArray = [];
    let weekNumArray = [];
    let actionSub = new Set();
    let classifiedTrainRecord = [];
    let trainRecord = [];
    // 获取本周的时间
    for (let i = 0; i < 7; i++) {
      dayArray.push(dayjs().weekday(i).format('YYYY-MM-DD'));
      weekNumArray.push(dayjs().weekday(i).format('dddd'))
    }

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTrainedRecordByDates',
      // 传给云函数的参数
      data: {
        dayArray: dayArray
      },
      success: res => {

        wx.showToast({
          title: '获取训练记录成功',
        })
        let result = res.result.data;
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].trainRecord.length; j++) {
            if (result[i].trainRecord[j].actionArea === this.data.area) {
              actionSub.add(result[i].trainRecord[j].actionSub);
              trainRecord.push(result[i].trainRecord[j]);
            }
          }
        }
        actionSub = Array.from(actionSub);

        for (let i = 0; i < actionSub.length; i++) {
          //  初始化分类好的数组
          let record = {
            actionSub: actionSub[i],
            trainRecord: []
          };
          classifiedTrainRecord.push(record);
        }
        //  遍历分类好的数组和训练记录，如果训练记录的area和classifiedTrainRecord的area相等，则将其的动作记录放入到其中
        for (let j = 0; j < classifiedTrainRecord.length; j++) {
          for (let i = 0; i < trainRecord.length; i++) {
            if (trainRecord[i].actionSub === classifiedTrainRecord[j].actionSub) {
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

  //初始化扇形图图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色为亮色
      const Chart = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getOption());
      // 添加上方的扇形图
      Chart.on('updateAxisPointer', function (event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1;
          Chart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取扇形图eharts设置数据
  getOption: function () {
    var option = {
      legend: {},
      tooltip: {
        trigger: 'axis',
        showContent: true
      },
      dataset: {
        source: this.data.pieDataset
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        gridIndex: 0
      },
      grid: {
        top: '55%'
      },
      series: this.data.pieSeries
    };
    return option
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
  // 获取扇形图数据
  getChartData: function () {
    // 获取本周的训练记录
    let dayArray = [];
    let weekNumArray = [];
    let actionSub = new Set();
    let area = this.data.area;
    // 图标dataset中的source数据
    let sourceData = [];
    let trainRecord = [];
    let pieSeries = [];
    // 时间数据
    let trainDate = new Set();
    // 获取本周的时间
    for (let i = 0; i < 7; i++) {
      dayArray.push(dayjs().weekday(i).format('YYYY-MM-DD'));
      weekNumArray.push(dayjs().weekday(i).format('dddd'))
    }

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
        // 处理获取来的数据
        let result = res.result.data;
        // 只获取本页面展示的子部位
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].trainRecord.length; j++) {
            if (result[i].trainRecord[j].actionArea === area) {
              actionSub.add(result[i].trainRecord[j].actionSub);
              trainDate.add(result[i].trainRecord[j].date);
              trainRecord.push(result[i].trainRecord[j]);
            }
          }
        }
        actionSub = Array.from(actionSub);
        trainDate = Array.from(trainDate);
        sourceData[0] = ['date'];
        // 添加时间
        for (let i = 0; i < trainDate.length; i++) {
          sourceData[0].push(trainDate[i]);
        }
        // 设置其他记录数据的名称
        for (let i = 0; i < actionSub.length; i++) {
          sourceData[i + 1] = [];
          sourceData[i + 1].push(actionSub[i]);
          for (let j = 0; j < trainRecord.length; j++) {
            if (trainRecord[j].actionSub === actionSub[i]) {
              sourceData[i + 1].push(trainRecord[j].trainComplishCount)
            }

          }
        }
        console.log('获取到的子部位', actionSub);
        console.log('获取到的sourceData', sourceData);

        // 根据实际部位去设定有多少根折线
        for (let i = 0; i < sourceData.length - 1; i++) {
          pieSeries.push({
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row'
          })
        }

        pieSeries.push( // 设定初始扇形图的数据
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{@' + sourceData[0][1] + '} ({d}%)'
            },
            encode: {
              itemName: 'count',
              value: sourceData[0][1],
              tooltip: sourceData[0][1]
            }
          })

        this.setData({
          pieDataset: sourceData,
          pieSeries: pieSeries
        })
        // 此处要与标签的id一致不是canvasid
        this.echartsComponnet = this.selectComponent('#mychart-dom-pie');
        this.init_echarts();

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      area: options.area || '胸部'
    });
    this.loadTrainedRecords();
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
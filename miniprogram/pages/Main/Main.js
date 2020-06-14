// pages/Main/Main.js
import * as echarts from '../../ec-canvas/echarts';
var utils = require('../../utils/util');
var app = getApp();


Page({
  data: {
    // 文章推荐部分
    dataFitness:false,
    // 页面中间的仪表盘
    gaugeec: {
      lazyLoad: true, // 延迟加载
    },
    targetWeight: 0,
    originWeight: 0,
    todayStep: 0,
    calories: 0,
    height: '',
    weight: '',
    fat:'',
    maxFat:26,
    // 初次设定身体数据的弹出层开关
    SetBody: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    trainStatus: "增肌",
    // 问候语
    hello: "早上好",
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
    // 日历的日期format方法
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();

      if (month === 5) {
        if (date === 12) {
          day.topInfo = "胸";
          day.bottomInfo = '4786';
          // var info = "<van-tag type='danger' plain >胸</van-tag>";
          // day.bottomInfo = document.write("<van-tag type='danger' plain >胸</van-tag>");
          // var tag = "<van-tag type='danger' plain >胸</van-tag>";
          // day.topInfo = WxParse.wxParse('topInfo', 'html', tag, that);
        }
      }
      return day;
    }
  },

  // 文章推荐的弹出层
  showdataFitness() {
    this.setData({ dataFitness: true });
  },

  onClosedataFitness() {
    this.setData({ dataFitness: false });
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
  //跳转训练界面
  beginTraining() {
    wx.navigateTo({
      url: "../Training/Training",
    })
  },
  showPlan() {
    wx.navigateTo({
      url: "../TrainTemplate/TrainTemplate",
    })
  },
  dataRecord() {
    wx.navigateTo({
      url: "../DataRecord/DataRecord",
    });
  },
  // 从云端获取数据的方法
  async getDataFromCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        let length = res.result.data.length;
        if (length === 0) {
          this.setData({
            SetBody: true
          })
        } else {
          wx.showToast({
            title: '获取个人数据成功',
          });
          app.globalData.bodydata = res.result.data[length - 1];
          app.globalData.bodydatas = res.result.data;
          console.log("身体数据:", app.globalData.bodydata);
          let status = res.result.data[length - 1].trainState;
          let height = res.result.data[length - 1].height;
          let weight = res.result.data[length - 1].weight;
          let targetWeight = res.result.data[length - 1].targetWeight;
          let originWeight = res.result.data[length - 1].originWeight;
          let fat = res.result.data[length - 1].fat;
          let calories = 0;
          /* 
          卡路里数=步数*身高*0.45*0.01/1000*体重*1.036
          */
          calories = (app.globalData.todayStep * height * 0.45 * 0.01 / 1000 * weight * 1.036).toFixed(0);
          this.setData({
            trainStatus: status,
            height: height,
            weight: weight,
            targetWeight: targetWeight,
            originWeight: originWeight,
            fat:fat,
            calories: calories
          });
          this.getGaugeChartData();
        }
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取失败',
          icon: "none"
        })
      }
    })
  },
  // 确认设定初始的身体状态，并保存至云端
  onSetBody() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addPersonalData',
      // 传给云函数的参数
      data: {
        date: app.globalData.date,
        trainState: "减脂",
        weight: this.data.weight,
        height: this.data.height,
        fat: 0,
        ass: 0,
        leg: 0,
        smallleg: 0,
        breast: 0,
        arms: 0,
        waist: 0,
        targetWeight: this.data.weight,
        // 目标开始时间
        targetStartTime: app.globalData.date,
        // 目标时间
        targetEndTime: app.globalData.date,
        // 训练目标没有改变，则原始体重也不变
        originWeight: this.data.weight,
        originWeightDate: app.globalData.date,
        sex: app.globalData.sex,
        todayStep: app.globalData.todayStep
      },
      success: res => {
        wx.showToast({
            title: '上传成功',
          }),
          this.setData({
            SetBody: false
          })
        // 添加成功后再去获取数据
        this.getDataFromCloud();
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '上传失败',
          icon: "none"
        })
      }
    })
  },
  // 关闭初次设置体重的页面
  onCloseSetBody() {
    this.setData({
      SetBody: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.werun']) {
          this.getUserInfoandRunData();
        } else {
          // 授权微信步数和用户信息
          wx.authorize({
            scope: 'scope.userInfo',
          }),
          wx.authorize({
            scope: 'scope.werun',
          })
          this.getUserInfoandRunData();
        }
      }
    })


    let date = app.globalData.date
    // 根据当前时间判断早上下午
    const now = new Date();
    const hour = now.getHours();
    let hello = '';
    if (hour < 6) {

      hello = "凌晨好";

    } else if (hour < 9) {

      hello = "早上好";

    } else if (hour < 12) {

      hello = "上午好";

    } else if (hour < 14) {

      hello = "中午好";

    } else if (hour < 17) {

      hello = "下午好";

    } else if (hour < 19) {

      hello = "傍晚好";

    } else if (hour < 22) {

      hello = "晚上好";

    } else {

      hello = "夜里好";

    }
    //获取当前时间和身体数据
    this.setData({
      date: date,
      hello: hello,
    });


  },
  //初始化仪表盘
  init_gaugeecharts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色为亮色
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getGaugeOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取仪表盘eharts设置数据
  getGaugeOption: function () {
    let min = this.data.originWeight;
    let max = this.data.targetWeight;
    if (max < min) {
      let temp = max;
      max = min;
      min = temp;
    }
    var option = {
      backgroundColor: 'black',
      tooltip: {
        trigger: 'item',
      },
      series: [
        // 体重表
        {
          name: '体重',
          type: 'gauge',
          min: min,
          max: max,
          splitNumber: 10,
          radius: '90%',
          tooltip: {
            trigger: 'item',
            formatter: '当前{a}:{c}kg'
          },
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [0.09, 'lime'],
                [0.82, '#1e90ff'],
                [1, '#ff4500']
              ],
              width: 3,
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisLabel: { // 坐标轴小标记
            fontWeight: 'bolder',
            color: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
            fontSize: 12
          },
          axisTick: { // 坐标轴小标记
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: { // 分隔线
            length: 25, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: { // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
          },
          title: {
            offsetCenter:[0,'50%'],
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 15,
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          // 中间显示数据的大小
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '80%'], // x, y，单位px
            formatter: '{value}kg',
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 15,
            }
          },
          data: [{
            value: this.data.weight,
            name: '体重',

          }]
        },
        // 步数表
        {
          name: '步数',
          type: 'gauge',
          center: ['20%', '55%'], // 默认全局居中
          radius: '65%',
          min: 0,
          max: 10,
          endAngle: 60,
          splitNumber: 5,
          tooltip: {
            trigger: 'item',
            formatter: '当前{a}:{c}k步'
          },
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [0.09, 'lime'],
                [0.82, '#1e90ff'],
                [1, '#ff4500']
              ],
              width: 2,
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisLabel: { // 坐标轴小标记
            fontWeight: 'bolder',
            color: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          },
          axisTick: { // 坐标轴小标记
            length: 12, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: { // 分隔线
            length: 20, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {
            width: 5,
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
          },
          title: {
            offsetCenter: [0, '60%'], // x, y，单位px
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '100%'], // x, y，单位px
            formatter: '{value}千步',
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 12,
            }
          },
          data: [{
            value: this.data.todayStep / 1000,
            name: '步数'
          }]
        },
        // 体脂表
        {
          name: '体脂',
          type: 'gauge',
          center: ['80%', '55%'], // 默认全局居中
          radius: '65%',
          min: 0,
          max: this.data.maxFat,
          startAngle:122,
          endAngle: -58,
          splitNumber: 5,
          tooltip: {
            trigger: 'item',
            formatter: '当前{a}:{c}%'
          },
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [0.09, 'lime'],
                [0.82, '#1e90ff'],
                [1, '#ff4500']
              ],
              width: 2,
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisLabel: { // 坐标轴小标记
            fontWeight: 'bolder',
            color: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          },
          axisTick: { // 坐标轴小标记
            length: 12, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: { // 分隔线
            length: 20, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {
            width: 5,
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
          },
          title: {
            offsetCenter: ['-20%', '60%'], // x, y，单位px
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: ['-20%', '100%'], // x, y，单位px
            formatter: '{value}%',
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 12,
            }
          },
          data: [{
            show:false,
            value: this.data.fat,
            name: '体脂'
          }]
        }
      ]
    };
    return option;
  },
  // 获取仪表盘数据
  getGaugeChartData: async function () {
    
      this.echartsComponnet = this.selectComponent('#mychart-dom-gauge');
      this.init_gaugeecharts();

  },
  async getUserInfoandRunData() {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    await wx.getUserInfo({
      success: res => {
        console.log(res.userInfo);
        let sex = res.userInfo.gender;
        // 设定男女最大体脂范围
        let maxFat = 0;
        if (sex === 1) {
          app.globalData.sex = '男',
          maxFat = 26;
        } else {
          app.globalData.sex = '女'
          maxFat = 32;
        }
        this.setData({
          nickName: res.userInfo.nickName,
          maxFat:maxFat
        })
        app.globalData.nickName = res.userInfo.nickName;
        console.log('性别是', app.globalData.sex);
      }
    })
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    await wx.getWeRunData({
      success: res => {
        wx.cloud.callFunction({
          name: 'getWxRunData',
          data: {
            weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
          }
        }).then(resData => {
          app.globalData.todayStep = resData.result.event.weRunData.data.stepInfoList[30].step;
          
          this.setData({
            todayStep: resData.result.event.weRunData.data.stepInfoList[30].step,
            
          })
         this.getDataFromCloud();
          console.log('今日步数', app.globalData.todayStep) //今天的步数
        })
      }
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log('设置选中项 0');
      this.getTabBar().setData({
        selected: 0
      })
    }
  }
})
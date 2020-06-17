// pages/Main/Main.js
import * as echarts from '../../ec-canvas/echarts';
import dayjs from '../../utils/dayjs/index';
import utils from '../../utils/util'
import duration from '../../utils/dayjs/plugin/duration/index';
require('../../utils/dayjs/locale/zh-cn');
dayjs.locale('zh-cn');
dayjs.extend(duration);
var app = getApp();
Page({
  data: {
    // 页面中间的仪表盘
    gaugeec: {
      lazyLoad: true, // 延迟加载
    },
    cutWeight: 0,
    targetWeight: 0,
    originWeight: 0,
    todayStep: 0,
    calories: 0,
    height: '',
    weight: '',
    fat: 0,
    maxFat: 26,
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
    maxDate: new Date().getTime()
  },

  //日期确认方法
  onConfirmCalendar(event) {
    // 最关键的是要改变全局的时间
    app.globalData.date = utils.formatDate(event.detail);
    this.setData({
      isCalendarShow: false,
      date: utils.formatDate(event.detail)
    });
    this.getBodyDataByDate();
  },
  // 根据日期从云端获取身体数据
  async getBodyDataByDate() {
    let date = this.data.date;
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalDataByDate',
      data: {
        date: date
      },
      success: res => {
        wx.showToast({
          title: '获取当天数据成功',
        });
        let result = res.result.data;
        if (result.length == 0) {
          let totalBodyDatas = app.globalData.bodydatas;
          console.log('已经存在的身体数据记录', totalBodyDatas);
          // 判断是否存在历史数据
          if (totalBodyDatas.length > 0) {
            // 离该天时间最短的天数
            let minDay = 0;
            let a = dayjs(date, 'YYYY-MM-DD');
            let b = dayjs(totalBodyDatas[0].date, 'YYYY-MM-DD');
            //选择的日期与记录中的数据相差的天数(应当获取的是绝对值时间)
            let c = Math.abs(dayjs.duration(a.diff(b)).days());
            let d = 0;
            for (let i = 0; i < totalBodyDatas.length; i++) {
              b = dayjs(totalBodyDatas[i].date, 'YYYY-MM-DD');
              d = Math.abs(dayjs.duration(a.diff(b)).days());
              if (d < c) {
                c = d;
                minDay = i;
              }
            }
            console.log('离该天数最近的有数据记录的时间', totalBodyDatas[minDay].date);
            // 将离该数据时间最短的身体数据赋予该结果
            result[0] = totalBodyDatas[minDay];
          } else {
            wx.showToast({
              title: '您暂时未记录任何身体数据！',
              title: 'none'
            })
            return false;
          }
        }
        // 将该天的身体数据设置为全局的身体数据
        app.globalData.bodydata = result[0];
        console.log('当天的数据', result);
        let status = result[0].trainState || '减脂';
        let height = result[0].height || 0;
        let weight = result[0].weight || 0;
        let targetWeight = result[0].targetWeight || 0;
        let originWeight = result[0].originWeight || 0;
        // 获取减去的体重
        let cutWeight = (weight - originWeight).toFixed(1);
        let fat = result[0].fat || 0;
        let calories = 0;
        let todayStep = result[0].todayStep;
        /* 
        卡路里数=步数*身高*0.45*0.01/1000*体重*1.036
        */
        calories = (app.globalData.todayStep * height * 0.45 * 0.01 / 1000 * weight * 1.036).toFixed(0);
        this.setData({
          cutWeight: cutWeight,
          trainStatus: status,
          height: height,
          weight: weight,
          targetWeight: targetWeight,
          originWeight: originWeight,
          fat: fat,
          calories: calories,
          todayStep: todayStep
        });
        this.getGaugeChartData();
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取当天数据失败',
          icon: "none"
        })
      }
    })
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
          console.log("最近的身体数据:", app.globalData.bodydata);
          let status = res.result.data[length - 1].trainState || '减脂';
          let height = res.result.data[length - 1].height || 0;
          let weight = res.result.data[length - 1].weight || 0;
          let targetWeight = res.result.data[length - 1].targetWeight || 0;
          let originWeight = res.result.data[length - 1].originWeight || 0;
          // 获取减去的体重
          let cutWeight = (weight - originWeight).toFixed(1);
          let fat = res.result.data[length - 1].fat || 0;
          let calories = 0;
          /* 
          卡路里数=步数*身高*0.45*0.01/1000*体重*1.036
          */
          calories = (app.globalData.todayStep * height * 0.45 * 0.01 / 1000 * weight * 1.036).toFixed(0);
          this.setData({
            cutWeight: cutWeight,
            trainStatus: status,
            height: height,
            weight: weight,
            targetWeight: targetWeight,
            originWeight: originWeight,
            fat: fat,
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
  // 获取用户的用户信息
  getUserInfo(res) {

    let sex = res.detail.userInfo.gender;
    if (sex) {
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
        nickName: res.detail.userInfo.nickName,
        maxFat: maxFat
      })
      app.globalData.nickName = res.detail.userInfo.nickName;
      console.log('性别是', app.globalData.sex);
      this.onSetBody();
    }else{
      this.onSetBody();
    }
  },
  // 关闭初次设置体重的页面
  onCloseSetBody() {
    this.setData({
      SetBody: false,
      weight: 0
    })
    this.getGaugeChartData();
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
            offsetCenter: [0, '50%'],
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
          startAngle: 122,
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
            show: false,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let date = utils.formatDate(new Date());

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log('设置选中项 0');
      this.getTabBar().setData({
        selected: 0
      })
    }

    if (app.globalData.bodydataChanged) {
      // 对比选中时间和当前时间，如果是当前时间则发起授权
      if (date === this.data.date) {
        // 查看是否授权
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo'] && res.authSetting['scope.werun']) {
              this.getUserInfoandRunData();
            } else {
              this.getDataFromCloud();
            }
          },
          fail: error => {
            this.getDataFromCloud();
            console.log('授权失败', error);
          }
        })
      } else {
        this.getBodyDataByDate();
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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

    // 对比选中时间和当前时间，如果是当前时间则发起授权
    if (date === this.data.date) {
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
                success: () => {
                  this.getUserInfoandRunData();
                },
                fail: () => {
                  this.getDataFromCloud();
                }
              })
          }
        },
        fail: error => {
          console.log('授权失败', error);
        }
      })
    } else {
      this.getBodyDataByDate();
    }
  },
})
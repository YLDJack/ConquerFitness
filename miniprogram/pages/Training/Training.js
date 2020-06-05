var utils = require('../../utils/util');
// pages/Training/Training.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 开始休息时间
    startRest: 0,
    // 编辑组数的标记
    delGroupsTag: false,
    // 按部位划分的记录数组
    totalArea: [],
    // 总组数
    TotalType: 0,
    TotalGroup: 0,
    TotalCount: 0,
    // 训练记录数组
    trainRecord: [],
    // 训练备注
    TrainMark: '',
    // 单个动作
    queryActionByName: [],
    // 点击图片显示弹出层的属性
    showPopup: false,
    // 删除的动作状态
    delActionsStatus: [],
    // 要删除的动作
    delActions: [],
    // del的标志
    delTag: false,
    hour: "00",
    minutes: "00",
    seconds: "00",
    count: 0,
    timer: null,
    value: 5,
    //下拉列表的初始状态
    activeNames: ['1'],
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    showClock: false,
    countdowntime: 60 * 1000,
    timeData: {},
    isPause: true,
    isStart: false,
    isGray: true,
    isRed: false
  },
  // 统计每个动作的已完成容量的方法
  countArea() {
    // 获取按部位计算的分类数组
    let totalArea = this.data.totalArea;
    let trainRecord = this.data.trainRecord;

    // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
    for (let k = 0; k < totalArea.length; k++) {
      // 每次遍历时，先将该部位的容量清0；因为这里是从头开始遍历整个记录，所有每个部位都会加到自己各自对应的地方上去的。
      totalArea[k].areaCount = 0;
      for (let j = 0; j < trainRecord.length; j++) {
        if (trainRecord[j].actionArea === totalArea[k].area) {
          totalArea[k].areaCount += trainRecord[j].trainComplishCount;
        }
      }
    }
    console.log('分类状态：', totalArea);
    this.setData({
      totalArea: totalArea
    });
  },
  // 输入重量完成后的监听事件
  onWeightConfirm(event) {
    let TotalGroup = 0;
    // 总容量
    let TotalCount = 0;
    let weight = event.detail.value;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    // 设置相应的重量到训练记录里
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;

    trainGroups[index1].trainWeight = weight;
    trainRecord[index].trainGroups = trainGroups;
    // 先把原来来的清空再进行相加
    trainRecord[index].trainCount = 0;
    trainRecord[index].trainComplishCount = 0;


    // 获取单个动作的总容量和完成容量直接设置到record中去
    for (let i = 0; i < trainGroups.length; i++) {
      // 添加总容量
      trainRecord[index].trainCount += trainGroups[i].trainWeight * trainGroups[i].trainNumber;
      // 添加总完成容量
      if (trainGroups[i].Complish) {
        trainRecord[index].trainComplishCount += trainGroups[i].trainNumber * trainGroups[i].trainWeight;

        // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
        this.countArea();
      }
    }
    //获取页面已完成的总组数和总容量
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;

      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }


    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    console.log('修改重量完成后的记录', trainRecord[index]);
    this.setData({
      trainRecord: trainRecord,
      TotalCount: TotalCount,
    });
  },
  // 输入次数完成后的监听事件
  onNumberConfirm(event) {
    let TotalGroup = 0;
    // 总容量
    let TotalCount = 0;
    let number = event.detail.value;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    // 设置相应的重量到训练记录里
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;

    trainGroups[index1].trainNumber = number;
    trainRecord[index].trainGroups = trainGroups;
    // 先把原来来的清空再进行相加
    trainRecord[index].trainCount = 0;
    trainRecord[index].trainComplishCount = 0;
    for (let i = 0; i < trainGroups.length; i++) {
      // 添加总容量
      trainRecord[index].trainCount += trainGroups[i].trainWeight * trainGroups[i].trainNumber;
      // 添加总完成容量
      if (trainGroups[i].Complish) {
        trainRecord[index].trainComplishCount += trainGroups[i].trainNumber * trainGroups[i].trainWeight;

        // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
        this.countArea();
      }
    }

    //获取已完成的总组数和总容量
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    console.log('修改数量完成后的记录', trainRecord[index]);
    this.setData({
      trainRecord: trainRecord,
      TotalCount: TotalCount,
    });
  },
  // 完成动作
  onComplish(event) {
    // 总容量
    let TotalCount = 0;
    // 总组数
    let TotalGroup = 0;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    console.log('完成动作的下标', index);
    console.log('完成动作组数的下标', index1);
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;

    // 将对应多的数组下标签取反
    trainGroups[index1].Complish = !trainGroups[index1].Complish;
    // 如果动作已完成则添加完成的容量
    if (trainGroups[index1].Complish) {
      trainRecord[index].trainComplishCount += trainGroups[index1].trainWeight * trainGroups[index1].trainNumber;
      // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
      this.countArea();
    } else {
      trainRecord[index].trainComplishCount -= trainGroups[index1].trainWeight * trainGroups[index1].trainNumber;

      // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
      this.countArea();
    }
    trainRecord[index].trainGroups = trainGroups;

    //获取已完成的总组数和总容量
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }
    console.log('完成之后的组数', trainRecord[index]);
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    this.setData({
      trainRecord: trainRecord,
      TotalCount: TotalCount,
      TotalGroup: TotalGroup,
    });
  },
  // 确认删除组数
  doDelGroups(event) {
    // 总容量
    let TotalCount = 0;
    // 总组数
    let TotalGroup = 0;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    console.log('删除的动作的下标', index);
    console.log('删除的动作组数的下标', index1);
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    // 删除组数后也要把动作中的已完成容量和总容量删除
    trainRecord[index].trainCount -= trainGroups[index1].trainNumber * trainGroups[index1].trainWeight;
    if (trainGroups[index1].Complish) {
      trainRecord[index].trainComplishCount -= trainGroups[index1].trainNumber * trainGroups[index1].trainWeight;
    }
    // 删除下标为index1的组数
    trainGroups.splice(index1, 1);
    trainRecord[index].trainGroups = trainGroups;

    //获取已完成的总组数和总容量
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }

    console.log('删除之后的组数', trainRecord[index].trainGroups);
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    this.setData({
      trainRecord: trainRecord,
      TotalCount: TotalCount,
      TotalGroup: TotalGroup
    })
  },
  // 开启删除组数
  onDelGroups() {
    this.setData({
      delGroupsTag: !this.data.delGroupsTag
    })
  },
  // 添加组数事件
  addgroup(event) {
    const index = event.currentTarget.dataset.index;
    let trainRecord = this.data.trainRecord;
    let addgroup = {
      trainWeight: '',
      trainNumber: '',
      trainRestTime: 30 * 1000,
      Complish: false
    };
    trainRecord[index].trainGroups.push(addgroup);
    console.log('要加组数的记录:', trainRecord[index].trainGroups);
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    this.setData({
      trainRecord: trainRecord,
    })
  },
  // 关闭弹出层事件
  onPopupClose() {
    this.setData({
      showPopup: false
    })
  },
  // 点击图片弹出动作详情
  showPopup(event) {
    const id = event.currentTarget.dataset.id;
    const data = this.data.trainRecord;
    let catedata = [];
    for (let i = 0; i < data.length; i++) {
      if (id === data[i]._id) {
        catedata.push(data[i]);
      }
    }
    this.setData({
      queryActionByName: catedata,
      showPopup: true
    })
    console.log("当前的动作是:", this.data.queryActionByName);
  },
  // 确认删除事件
  onDel() {
    let trainRecord = this.data.trainRecord;
    let delActions = this.data.delActions;
    for (let i = 0; i < trainRecord.length; i++) {
      for (let j = 0; j < delActions.length; j++) {
        if (trainRecord[i] == delActions[j]) {
          trainRecord.splice(i, 1)
        }
      }
    }
    app.globalData.trainRecord = trainRecord;
    this.setData({
      trainRecord: trainRecord,
      delActionsStatus: [],
      delActions: []
    })
  },
  // 每个动作右边的checkbox点击事件
  onDelChange(event) {
    let index = event.currentTarget.dataset.index;
    let delActionsStatus = this.data.delActionsStatus;
    let delActions = this.data.delActions;
    let trainRecord = this.data.trainRecord;
    console.log('训练的动作', index);
    if (!delActionsStatus[index]) {
      delActionsStatus[index] = true;
      // 如果是要删除的数据，则将其加入delActions
      delActions.push(trainRecord[index]);
    } else {
      delActionsStatus[index] = false;
      // 如果是取消删除的数据，则将其从delActions中删除
      let delindex = delActions.indexOf(trainRecord[index]);
      console.log('要删除的id', delindex)
      // 新建了一个数组，并修改了原数组。所以不用赋值
      delActions.splice(delindex, 1);
    }
    // // 将相应index取反
    // delActionsStatus[index] = !delActionsStatus[index];
    this.setData({
      delActionsStatus: delActionsStatus,
      delActions: delActions
    })
    console.log('删除的状态', delActionsStatus);
    console.log('删除的数据的id', delActions);
  },
  // 点击编辑按钮事件
  startDel() {
    this.setData({
      delTag: !this.data.delTag,
      // 点击取消后要将删除和删除选中数组清空
      delActions: [],
      delActionsStatus: []
    })
  },
  // 页面顶部正计时处理单个数字
  showNum(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  },
  // 页面顶部正计时点击开始按钮
  onStartClock: function () {
    let timer = this.data.timer;
    console.log(timer);
    if (timer) {
      return false;
    } else {
      timer = setInterval(
        () => {
          var countNew = this.data.count + 1;
          this.setData({
            count: countNew,
            seconds: this.showNum(countNew % 60),
            minutes: this.showNum(parseInt(countNew / 60) % 60),
            hour: this.showNum(parseInt(countNew / 3600))
          })
        }, 1000);
      this.setData({
        timer: timer
      });
    }
  },

  // 顶部暂停按钮
  onPauseClock: function () {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    });
  },
  // 顶部停止按钮
  onStopClock: function () {
    clearInterval(this.data.timer),
      this.setData({
        count: 0,
        seconds: "00",
        minutes: "00",
        hour: "00",
        timer: null
      })
  },

  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // 倒计时按钮弹出层
  showClockPopup(event) {
    // 总容量
    let TotalCount = 0;
    // 总组数
    let TotalGroup = 0;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的下标
    const index1 = event.currentTarget.dataset.index1;
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    // 应当点击计时之后同时完成动作,如果动作已经是完成了的，则不作任何操作
    if (!trainGroups[index1].Complish) {
      trainGroups[index1].Complish = true;
      trainRecord[index].trainComplishCount += trainGroups[index1].trainWeight * trainGroups[index1].trainNumber;

      // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
      this.countArea();
    }
    trainRecord[index].trainGroups = trainGroups;
    //获取已完成的总组数和总容量
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }
    let startRest1 = Date.now();
    // 每次开始倒计时前都重新获取数据中的倒计时事件，这个必须在showClock: true前面否则会造成闪退。
    const countDown = this.selectComponent('#control-count-down');
    let time1 = trainRecord[index].trainGroups[index1].trainRestTime;
    console.log(time1);
    countDown.setData({
      time: time1,
      groupIndex: index1
    });
    countDown.start();
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    this.setData({
      trainRecord: trainRecord,
      TotalCount: TotalCount,
      TotalGroup: TotalGroup,
      startRest: startRest1,
      showClock: true,
    });
  },
  // 闹钟弹出层关闭按钮
  onCloseClock() {
    this.countdownFinished();
    const countDown = this.selectComponent('#control-count-down');
    countDown.reset();
  },
  // 结束倒计时时触发的事件
  countdownFinished() {
    let startRest = this.data.startRest;
    let stopRest = Date.now();
    // 每次开始倒计时前都重新获取数据中的倒计时事件
    const countDown = this.selectComponent('#control-count-down');
    let index1 = countDown.data.groupIndex;
    let time = (stopRest - startRest) / 1000;
    let time1 = time.toFixed(0) + 's';
    const icon = this.selectComponent('#resttime' + index1);
    icon.setData({
      info: time1
    });
    this.setData({
      showClock: false
    });
  },
  // 添加十秒倒计时事件
  addTenSeconds() {
    // 获取倒计时的dom对象
    const countDown = this.selectComponent('#control-count-down');
    let timeData = this.data.timeData;
    timeData.seconds += 10;
    // 通过设置自定义控件的数据来设置方法
    let time1 = (timeData.seconds + 1 + timeData.minutes * 60) * 1000;
    countDown.setData({
      time: time1
    })
    // 设置完时间要重新开始
    countDown.start();
    this.setData({
      timeData: timeData
    })

  },
  // 减少十秒倒计时事件
  subTenSeconds() {
    // 获取倒计时的dom对象
    const countDown = this.selectComponent('#control-count-down');
    let timeData = this.data.timeData;
    if (timeData.seconds > 10) {
      timeData.seconds -= 10;
    } else {
      timeData.seconds = 0;
    }
    // 通过设置自定义控件的数据来设置方法
    let time1 = (timeData.seconds + 1 + timeData.minutes * 60) * 1000;
    countDown.setData({
      time: time1
    })
    // 设置完时间要重新开始
    countDown.start();
    this.setData({
      timeData: timeData
    })

  },
  // 设定休息时间事件
  onRestTimeConfirm(event) {
    // 获取倒计时的dom对象
    const countDown = this.selectComponent('#control-count-down');
    // 文本框输入的时间
    let time1 = event.detail.value;
    let timeData = this.data.timeData;
    timeData.seconds = time1;
    countDown.setData({
      time: time1 * 1000
    })
    countDown.start();
    this.setData({
      timeData: timeData
    });
  },
  // 倒计时事件
  onChangeClock(e) {
    this.setData({
      timeData: e.detail || e,
    });
  },

  // clock弹出层中的按钮
  pauseToStart() {
    if (this.data.isPause) {
      this.setData({
        isStart: true,
        isPause: false
      });
    } else if (this.data.isStart) {
      this.setData({
        isStart: false,
        isPause: true,
        isRed: false,
        isGray: true
      });
    }
  },
  stopToReset() {
    if (this.data.isGray) {
      this.setData({
        isGray: false,
        isRed: true
      })
    }
  },

  // 添加动作跳转
  addTrain() {
    // 关闭当前页，直接跳转
    wx.navigateTo({
      url: '../ActionAdd/ActionAdd',
    })
  },
  //模板训练跳转
  showTem() {
    wx.navigateTo({
      url: '../TrainTemplate/TrainTemplate',
    })
  },
  // 评价的点击函数
  onChange(event) {
    this.setData({
      value: event.detail
    });
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
    let trainingActions = app.globalData.trainingActions;
    console.log('获取到的动作', trainingActions);
    // 从全局中获取
    let trainRecord = app.globalData.trainRecord || [];
    let totalArea = this.data.totalArea;
    let areas = new Set();
    console.log('获取到的记录', trainRecord);
    for (let i = 0; i < trainRecord.length; i++) {
      for (let j = 0; j < trainingActions.length; j++) {
        // 如果本页中的trainRecord中已经存在该动作，则不需要再添加了
        if (trainRecord[i]._id == trainingActions[j]._id) {
          trainingActions.splice(j, 1);
        }
      }
    }
    // 初始化剩下的动作
    for (let i = 0; i < trainingActions.length; i++) {
      areas.add(trainingActions[i].actionArea);
      trainingActions[i].trainCount = 0;
      trainingActions[i].trainComplishCount = 0;
      trainingActions[i].trainGroups = [{
        trainWeight: '',
        trainNumber: '',
        trainRestTime: 30 * 1000,
        Complish: false
      }]
    }
    areas = Array.from(areas);
    for (let i = 0; i < areas.length; i++) {
      let oneArea = {
        area: areas[i],
        // 动作个数
        areaType: 0,
        // 动作总容量
        areaCount: 0,
      }
      totalArea.push(oneArea);
    }
    // 将这些动作加入到record
    trainRecord = trainRecord.concat(trainingActions);
    for (let i = 0; i < totalArea.length; i++) {
      totalArea[i].areaType = 0;
      for (let j = 0; j < trainRecord.length; j++) {
        // 获取每个部位的动作的种类数
        if (trainRecord[j].actionArea === totalArea[i].area) {
          totalArea[i].areaType += 1;
        }
      }
    }
    //设置全局变量的记录
    app.globalData.trainRecord = trainRecord;
    console.log('动作部位', totalArea);
    this.setData({
      TotalType: trainRecord.length,
      totalArea: totalArea,
      trainRecord: trainRecord
    })
    // 如果训练动作不为空则自动开始计时
    if (trainRecord.length) {
      this.onStartClock();
    }
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
    //当页面卸载时要保存训练记录，之后也要保存时间
    app.globalData.trainRecord = this.data.trainRecord;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
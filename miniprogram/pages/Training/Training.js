// pages/Training/Training.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 编辑组数的标记
    delGroupsTag: false,
    // 总组数
    TotalType: 0,
    TotalGroup: 0,
    TotalCount: 0,
    // 训练记录数组
    TrainRecord: [],
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
  // 输入重量完成后的监听事件
  onWeightConfirm(event) {
    let weight = event.detail.value;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    // 设置相应的重量到训练记录里
    let trainRecord = this.data.TrainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    trainGroups[index1].trainWeight = weight;
    trainRecord[index].trainGroups = trainGroups;
    // 先把运来的清空再进行相加
    trainRecord[index].trainCount = 0;
    for (let i = 0; i < trainGroups.length; i++) {
      trainRecord[index].trainCount += trainGroups[i].trainWeight * trainGroups[i].trainNumber
    }
    console.log('修改重量完成后的记录', trainRecord[index]);
    this.setData({
      TrainRecord: trainRecord,
    });
  },
  // 输入次数完成后的监听事件
  onNumberConfirm(event) {

    let number = event.detail.value;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    // 设置相应的重量到训练记录里
    let trainRecord = this.data.TrainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    trainGroups[index1].trainNumber = number;
    trainRecord[index].trainGroups = trainGroups;
    trainRecord[index].trainCount = 0;
    for (let i = 0; i < trainGroups.length; i++) {
      trainRecord[index].trainCount += trainGroups[i].trainWeight * trainGroups[i].trainNumber
    }
    console.log('修改数量完成后的记录', trainRecord[index]);
    this.setData({
      TrainRecord: trainRecord,
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
    let trainRecord = this.data.TrainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    // 将对应多的数组下标签取反
    trainGroups[index1].Complish = !trainGroups[index1].Complish;
    // 如果动作已完成则添加完成的容量
    if (trainGroups[index1].Complish) {
      trainRecord[index].trainComplishCount += trainGroups[index1].trainWeight * trainGroups[index1].trainNumber
    } else {
      trainRecord[index].trainComplishCount -= trainGroups[index1].trainWeight * trainGroups[index1].trainNumber
    }

    //获取已完成的总组数
    for (let i = 0; i < trainRecord.length; i++) {
      TotalCount += trainRecord[i].trainComplishCount;
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        if (trainRecord[i].trainGroups[j].Complish) {
          TotalGroup++;
        }
      }
    }
    trainRecord[index].trainGroups = trainGroups;

    console.log('完成之后的组数', trainRecord[index].trainGroups);
    this.setData({
      TrainRecord: trainRecord,
      TotalCount:TotalCount,
      TotalGroup:TotalGroup
    })
  },
  // 确认删除组数
  doDelGroups(event) {
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    console.log('删除的动作的下标', index);
    console.log('删除的动作组数的下标', index1);
    let trainRecord = this.data.TrainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    // 删除组数后也要把动作中的已完成容量和总容量删除
    trainRecord[index].trainCount -= trainGroups[index1].trainNumber * trainGroups[index1].trainWeight;
    if (trainGroups[index1].Complish) {
      trainRecord[index].trainComplishCount -= trainGroups[index1].trainNumber * trainGroups[index1].trainWeight;
    }
    // 删除下标为index1的组数
    trainGroups.splice(index1, 1);
    trainRecord[index].trainGroups = trainGroups;
    console.log('删除之后的组数', trainRecord[index].trainGroups);
    this.setData({
      TrainRecord: trainRecord,
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
    let trainRecord = this.data.TrainRecord;
    let addgroup = {
      trainWeight: '',
      trainNumber: '',
      trainRestTime: 30 * 1000,
      Complish: false
    };
    trainRecord[index].trainGroups.push(addgroup);
    console.log('要加组数的记录:', trainRecord[index].trainGroups);
    this.setData({
      TrainRecord: trainRecord,
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
    const data = this.data.trainingActions;
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
    let trainingActions = this.data.trainingActions;
    let delActions = this.data.delActions;
    for (let i = 0; i < trainingActions.length; i++) {
      for (let j = 0; j < delActions.length; j++) {
        if (trainingActions[i] == delActions[j]) {
          trainingActions.splice(i, 1)
        }
      }
    }
    app.globalData.trainingActions = trainingActions;
    this.setData({
      trainingActions: trainingActions,
      delActionsStatus: [],
      delActions: []
    })
  },
  // 每个动作右边的checkbox点击事件
  onDelChange(event) {
    let index = event.currentTarget.dataset.index;
    let delActionsStatus = this.data.delActionsStatus;
    let delActions = this.data.delActions;
    let trainingActions = this.data.trainingActions;
    console.log('训练的动作', index);
    if (!delActionsStatus[index]) {
      delActionsStatus[index] = true;
      // 如果是要删除的数据，则将其加入delActions
      delActions.push(trainingActions[index]);
    } else {
      delActionsStatus[index] = false;
      // 如果是取消删除的数据，则将其从delActions中删除
      let delindex = delActions.indexOf(trainingActions[index]);
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

  // Clock按钮弹出层
  showClockPopup() {
    this.setData({
      showClock: true
    });
  },
  onCloseClock() {
    this.setData({
      showClock: false
    });
  },

  // 倒计时事件
  onChangeClock(e) {
    this.setData({
      timeData: e.detail,
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
    let trainingActions = app.globalData.trainingActions;
    let length = trainingActions.length || 0;
    let trainRecord = this.data.TrainRecord;
    for (let i = 0; i < length; i++) {
      // 初始化训练记录
      trainRecord[i] = trainingActions[i];
      trainRecord[i].trainCount = 0;
      trainRecord[i].trainComplishCount = 0;
      trainRecord[i].trainGroups = [{
        trainWeight: '',
        trainNumber: '',
        trainRestTime: 30 * 1000,
        Complish: false
      }]
    }

    console.log('训练记录', trainRecord);
    this.setData({
      TotalType: length,
      TrainRecord: trainRecord,
    })
    // 如果训练动作不为空则自动开始计时
    if (length) {
      this.onStartClock();
    }
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
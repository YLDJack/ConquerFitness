import Toast from '@vant/weapp/toast/toast';
var utils = require('../../utils/util');
// pages/Training/Training.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
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
    // 页面总体的计时时间
    hour: "00",
    minutes: "00",
    seconds: "00",
    timer: null,
    count: 0,
    // 有氧运动正计时的即使时间
    aerohour: "00",
    aerominutes: "00",
    aeroseconds: "00",
    aerotimer: null,
    aerocount: 0,
    value: 5,
    //下拉列表的初始状态
    activeNames: ['1'],
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24'
    },
    // 力量训练休息时间倒计时
    showClock: false,
    // 有氧运动计时的弹出框
    showAerobicClock: false,
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
      // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
      this.countArea();
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
  // 确认删除动作事件
  onDel() {
    // 总容量
    let TotalCount = this.data.TotalCount;
    // 总组数
    let TotalGroup = this.data.TotalGroup;
    let trainRecord = this.data.trainRecord;
    let delActions = this.data.delActions;
    let TotalType = this.data.TotalType;
    let areas1 = new Set();
    let totalArea = [];
    // 设定删除之后的选择数组
    let selectStatus = [];
    let selectActions = [];

    for (let i = 0; i < trainRecord.length; i++) {
      for (let j = 0; j < delActions.length; j++) {
        if (trainRecord[i] == delActions[j]) {
          // 如果删除的动作已经完成的,应当删除页面中的种类数，已经完成容量和组数
          trainRecord[i].isSelected = false;
          TotalCount -= trainRecord[i].trainComplishCount;
          for (let k = 0; k < trainRecord[i].trainGroups.length; k++) {
            if (trainRecord[i].trainGroups[k].Complish) {
              trainRecord[i].trainComplishCount -= trainRecord[i].trainGroups[k].trainNumber * trainRecord[i].trainGroups[k].trainWeight;
              TotalGroup--;
              // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
              this.countArea();
            }

          }
          trainRecord.splice(i, 1);
          TotalType -= 1;
        }
      }
    }

    // 删除了相应的数据之后，还要对统计数组进行处理
    for (let i = 0; i < trainRecord.length; i++) {
      areas1.add(trainRecord[i].actionArea);
      //修改选择动作的数组
      selectStatus[trainRecord[i]._id] = true;
      selectActions.push(trainRecord[i]);
    }
    app.globalData.selectActions = selectActions;
    app.globalData.selectStatus = selectStatus;
    areas1 = Array.from(areas1);
    for (let i = 0; i < areas1.length; i++) {
      let oneArea = {
        area: areas1[i],
        // 动作个数
        areaType: 0,
        // 动作总容量
        areaCount: 0,
      }
      totalArea.push(oneArea);
    }
    for (let i = 0; i < totalArea.length; i++) {
      for (let j = 0; j < trainRecord.length; j++) {
        // 获取每个部位的动作的种类数
        if (trainRecord[j].actionArea === totalArea[i].area) {
          totalArea[i].areaType += 1;
          totalArea[i].areaCount += trainRecord[j].trainComplishCount;
        }
      }
    }



    app.globalData.trainRecord = trainRecord;
    this.setData({
      totalArea: totalArea,
      trainRecord: trainRecord,
      delActionsStatus: [],
      delActions: [],
      TotalType: TotalType,
      TotalCount: TotalCount,
      TotalGroup: TotalGroup
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
    console.log('页面计时器', timer);
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
  // 有氧运动正计时开始按钮
  onStartAerobicClock: function () {
    let timer = this.data.aerotimer;
    if (timer) {
      return false;
    } else {
      timer = setInterval(
        () => {
          var countNew = this.data.aerocount + 1;
          this.setData({
            aerocount: countNew,
            aeroseconds: this.showNum(countNew % 60),
            aerominutes: this.showNum(parseInt(countNew / 60) % 60),
            aerohour: this.showNum(parseInt(countNew / 3600))
          })
        }, 1000);
      this.setData({
        aerotimer: timer
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
  // 有氧运动计时暂停按钮
  onPauseAerobicClock: function () {
    clearInterval(this.data.aerotimer);
    this.setData({
      aerotimer: null
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
  // 顶部停止按钮
  onStopAerobicClock: function () {
    clearInterval(this.data.aerotimer),
      this.setData({
        aerocousnt: 0,
        aeroseconds: "00",
        aerominutes: "00",
        aerohour: "00",
        aerotimer: null
      })
  },

  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // 运动休息时间倒计时按钮弹出层
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
      actionIndex: index,
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
  // 有氧训练正计时弹出层
  showAerobicClockPopup(event) {
    // 展示出页面应该直接开始计时
    this.onStartAerobicClock();
    this.setData({
      showAerobicClock: true,
    });
  },
  // 闹钟弹出层关闭事件
  onCloseClock(event) {
    this.countdownFinished(event);
    const countDown = this.selectComponent('#control-count-down');
    countDown.reset();
  },
  // 有氧运动正计时弹出层关闭事件
  onCloseAerobicClock(event) {
    let index1 = event.currentTarget.dataset.index1;
    let index = event.currentTarget.dataset.index;
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    let totalArea = this.data.totalArea;
    let aeroseconds = this.data.aeroseconds;
    let aerominutes = this.data.aerominutes;
    let aerohour = parseInt(this.data.aerohour) * 60;
    let time = (aerohour + parseInt(aerominutes)) + '分' + aeroseconds + '秒';
    let name = '#aerobictime' + index + '' + index1;
    console.log('iconname', name);
    const icon = this.selectComponent(name)
    trainGroups[index1].trainRestTime = (aerohour * 3600 + aerominutes * 60 + aeroseconds) * 1000;
    icon.setData({
      info: time
    });
    for (let i = 0; i < totalArea.length; i++) {
      if (totalArea.area = '有氧') {
        totalArea[i].areaCount += parseInt(aerominutes);
      }
    }
    // 结束计时的时候要把计时器清空
    clearInterval(this.data.aerotimer),
      this.setData({
        totalArea: totalArea,
        aerocousnt: 0,
        aeroseconds: "00",
        aerominutes: "00",
        aerohour: "00",
        aerotimer: null,
        showAerobicClock: false,
      });
  },
  // 结束倒计时时触发的事件
  countdownFinished(event) {
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的下标
    const index1 = event.currentTarget.dataset.index1;
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    let startRest = this.data.startRest;
    let stopRest = Date.now();
    // 每次开始倒计时前都重新获取数据中的倒计时事件
    const countDown = this.selectComponent('#control-count-down');
    let index2 = countDown.data.actionIndex;
    let index3 = countDown.data.groupIndex;
    let time = (stopRest - startRest) / 1000;
    let time1 = time.toFixed(0) + 's';
    const icon = this.selectComponent('#resttime' + index2 + '' + index3);

    // 将实际的休息时间传递给动作记录数组
    if (trainGroups[index1].Complish) {
      trainGroups[index1].trainRestTime = time * 1000;
    }

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
    this.setData({
      delTag: false
    })
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
  // 完成训练按钮点击事件
  onFinishTraining() {
    let date = app.globalData.date;
    let trainRecord = this.data.trainRecord;
    let totalArea = this.data.totalArea;
    let TotalType = this.data.TotalType;
    let TotalGroup = this.data.TotalGroup;
    let TotalCount = this.data.TotalCount;
    let TrainMark = this.data.TrainMark;
    console.log('训练备注', TrainMark);

    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '上传训练数据中...',
      duration: 0,
      loadingType: "circular"
    });


    // 上传每个动作的训练记录尤其是最大重量容量以及总容量
    for (let i = 0; i < trainRecord.length; i++) {

      let maxWeight = trainRecord[i].maxWeight;
      let maxCount = trainRecord[i].maxCount;
      let currentCount = 0;
      // 对比这次训练和历史最大重量和容量，如果较大则赋值
      for (let j = 0; j < trainRecord[i].trainGroups.length; j++) {
        
        if (parseInt(trainRecord[i].trainGroups[j].trainWeight) > maxWeight) {
          maxWeight = parseInt(trainRecord[i].trainGroups[j].trainWeight);
          console.log('最大重量', maxWeight);
        }
        currentCount += trainRecord[i].trainGroups[j].trainWeight * trainRecord[i].trainGroups[j].trainNumber;
      }
      if (currentCount > maxCount) {
        maxCount = currentCount;
      }
      // 查询数据库中当天的记录是否已经存在，若存在则进行更新，否则直接进行添加
      wx.cloud.callFunction({
        // 云函数名称
        name: 'queryActionRecordByDate',
        // 传给云函数的参数
        data: {
          date: date,
          actionId: trainRecord[i]._id,
        },
        success: res => {
          // 代表存在该数据
          if (res.result.data.length > 0) {
            console.log('最大重量',maxWeight);
            // 若已存在当天的记录那么就直接进行更新
            wx.cloud.callFunction({
              // 云函数名称
              name: 'updateActionRecord',
              // 传给云函数的参数
              data: {
                date: date,
                actionId: trainRecord[i]._id,
                actionName: trainRecord[i].actionName,
                maxCount: maxCount,
                maxWeight: maxWeight,
                trainCount: trainRecord[i].trainCount
              },
              success: res => {

              },
              fail: error => {
                toast.clear();
                console.log(error);
                wx.showToast({
                  title: '上传动作记录失败',
                  icon: "none"
                })
              }
            })
          } else {
            // 添加动作记录
            wx.cloud.callFunction({
              // 云函数名称
              name: 'addActionRecord',
              // 传给云函数的参数
              data: {
                date: date,
                actionId: trainRecord[i]._id,
                actionName: trainRecord[i].actionName,
                maxCount: maxCount,
                maxWeight: maxWeight,
                trainCount: trainRecord[i].trainCount
              },
              success: res => {

              },
              fail: error => {
                toast.clear();
                console.log(error);
                wx.showToast({
                  title: '上传失败',
                  icon: "none"
                })
              }
            })
          }
        },
        fail: error => {
          toast.clear();
          console.log(error);
          wx.showToast({
            title: '查询动作记录失败',
            icon: "none"
          })
        }
      });
    }
    // 查询训练记录如果已经存在，当天的记录则进行更新，否则直接添加
    wx.cloud.callFunction({
      // 云函数名称
      name: 'queryTrainedRecord',
      // 传给云函数的参数
      data: {
        date: date
      },
      success: res => {
        // 代表存在该数据
        if (res.result.data.length > 0) {
          // 若已存在当天的记录那么就直接进行更新
          wx.cloud.callFunction({
            // 云函数名称
            name: 'updateTrainedRecord',
            // 传给云函数的参数
            data: {
              date: date,
              trainRecord: trainRecord,
              TrainMark: TrainMark,
              TotalType: TotalType,
              TotalGroup: TotalGroup,
              TotalCount: TotalCount,
              totalArea: totalArea,

            },
            success: res => {
              toast.clear();
              wx.showToast({
                title: '上传成功',
              })
            },
            fail: error => {
              toast.clear();
              console.log(error);
              wx.showToast({
                title: '更新训练记录失败',
                icon: "none"
              })
            }
          })
        } else {
          // 添加整个训练记录
          wx.cloud.callFunction({
            // 云函数名称
            name: 'addTrainedRecord',
            // 传给云函数的参数
            data: {
              date: date,
              TrainMark: TrainMark,
              trainRecord: trainRecord,
              TotalType: TotalType,
              TotalGroup: TotalGroup,
              TotalCount: TotalCount,
              totalArea: totalArea,
            },
            success: res => {
              toast.clear();
              wx.showToast({
                title: '上传成功',
              })
            },
            fail: error => {
              toast.clear();
              console.log(error);
              wx.showToast({
                title: '上传失败',
                icon: "none"
              })
            }
          })
        }
        app.globalData.complishTraining = true;
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '查询训练记录失败',
          icon: "none"
        })
      }
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
    let date = app.globalData.date;
    let today = utils.formatDate(new Date());
    // 如果是当天，则获取当前全局保存的训练记录
    if (today === date) {
      this.initTrainRecord();
    }
    // 如果不为当天则从数据库中获取训练记录
    else {
      this.getTrainRecordByDate(date);
    }

  },
  // 根据日期去获取训练记录
  getTrainRecordByDate(date) {

    let dateArray = [];
    dateArray.push(date);

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTrainedRecordByDates',
      // 传给云函数的参数
      data: {
        dayArray: dateArray
      },
      success: res => {

        wx.showToast({
          title: '获取训练记录成功',
        })
        let result = res.result.data[0];
        let trainRecord = result.trainRecord;
        console.log('获取到的训练记录', trainRecord);
        this.setData({
          TotalType: trainRecord.length,
          totalArea: result.totalArea,
          trainRecord: trainRecord,
          date: date
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
  // 初始化训练记录
  initTrainRecord() {
    let date = app.globalData.date;
    let trainingActions = app.globalData.trainingActions;
    // 从全局中获取
    let trainRecord = app.globalData.trainRecord || [];
    let totalArea = this.data.totalArea;
    let existAreas = [];
    let actionId = new Set();
    let areas = new Set();
    console.log('1、获取到的记录', trainRecord);



    for (let i = 0; i < trainRecord.length; i++) {
      for (let j = 0; j < trainingActions.length; j++) {
        // 如果本页中的trainRecord中已经存在该动作，则不需要再添加了
        if (trainRecord[i]._id == trainingActions[j]._id) {
          trainingActions.splice(j, 1);
        }
      }
    }
    console.log('2、需要添加的记录', trainingActions);

    for (let i = 0; i < trainingActions.length; i++) {
      actionId.add(trainingActions[i]._id);
    }
    actionId = Array.from(actionId);

    // 此时应当对每个动作发起查询，获取其最大容量和和最大重量
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'queryActionRecord',
      data: {
        actionId: actionId
      }
    }).then(res => {
      console.log('3、res', res.result.data);
      let actionRecord = res.result.data;
      for (let i = 0; i < trainingActions.length; i++) {
        areas.add(trainingActions[i].actionArea);
        trainingActions[i].trainCount = 0;
        trainingActions[i].trainComplishCount = 0;
        trainingActions[i].trainGroups = [{
          trainReamark: '',
          trainWeight: '',
          trainNumber: '',
          trainRestTime: 30 * 1000,
          Complish: false
        }]
        trainingActions[i].date = this.data.date;
        trainingActions[i].maxCount = 0;
        trainingActions[i].maxWeight = 0;
        // 解决每次只能获取最后一个动作的bug
        for (let j = 0; j < actionRecord.length; j++) {
          if (actionRecord[j].actionId === trainingActions[i]._id) {
            trainingActions[i].maxCount = actionRecord[j].maxCount;
            trainingActions[i].maxWeight = actionRecord[j].maxWeight;
          }
        }

      }
      // 获取统计中已经存在的部位
      for (let i = 0; i < totalArea.length; i++) {
        existAreas.push(totalArea[i].area);
      }
      console.log('4、已存在的动作部位', existAreas);
      areas = Array.from(areas);
      // 原来如果已经存在相同的部位的数据，应当不再进行初始化
      for (let i = 0; i < areas.length; i++) {
        if (existAreas.indexOf(areas[i]) == -1) {
          let oneArea = {
            area: areas[i],
            // 动作个数
            areaType: 0,
            // 动作总容量
            areaCount: 0,
          }
          totalArea.push(oneArea);
        }

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

      this.setData({
        TotalType: trainRecord.length,
        totalArea: totalArea,
        trainRecord: trainRecord,
        date: date
      });
      // 如果训练动作不为空则自动开始计时
      if (trainRecord.length) {
        this.onStartClock();
      }
    }).catch(console.error)

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
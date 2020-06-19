// miniprogram/pages/addTemplateDisplay/addTemplateDisplay.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 计划名称
    planName: '',
    // 计划动作列表
    planActions: [],
    // 总组数
    TotalGroup: '',
    // 总类型数
    TotalType: '',
    // 各个分类的类别数
    totalArea: [],
    //下拉列表的初始状态
    activeNames: ['1'],
    // 编辑组数的标记
    delGroupsTag: false,
    // 编辑动作标记
    delTag: false,
    // 要删除的动作和动作状态
    delActions: [],
    delActionsStatus: []
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
  // 统计每个部位的已完成容量的方法
  countArea() {
    // 获取按部位计算的分类数组
    let totalArea = this.data.totalArea;
    let planActions = this.data.planActions;

    // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
    for (let k = 0; k < totalArea.length; k++) {
      // 每次遍历时，先将该部位的容量清0；因为这里是从头开始遍历整个记录，所有每个部位都会加到自己各自对应的地方上去的。
      totalArea[k].areaCount = 0;
      for (let j = 0; j < planActions.length; j++) {
        if (planActions[j].actionArea === totalArea[k].area) {
          totalArea[k].areaCount += planActions[j].trainComplishCount;
        }
      }
    }
    console.log('分类状态：', totalArea);
    this.setData({
      totalArea: totalArea
    });
  },
  // 点击编辑动作按钮事件
  startDel() {
    this.setData({
      delTag: !this.data.delTag,
      // 点击取消后要将删除和删除选中数组清空
      delActions: [],
      delActionsStatus: []
    })
  },
  // 每个动作右边的checkbox点击事件
  onDelChange(event) {
    let index = event.currentTarget.dataset.index;
    let delActionsStatus = this.data.delActionsStatus;
    let delActions = this.data.delActions;
    let planActions = this.data.planActions;
    console.log('训练的动作', index);
    if (!delActionsStatus[index]) {
      delActionsStatus[index] = true;
      // 如果是要删除的数据，则将其加入delActions
      delActions.push(planActions[index]);
    } else {
      delActionsStatus[index] = false;
      // 如果是取消删除的数据，则将其从delActions中删除
      let delindex = delActions.indexOf(planActions[index]);
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
  // 确认删除动作事件
  onDel() {
    // 总组数
    let TotalGroup = this.data.TotalGroup;
    let planActions = this.data.planActions;
    let delActions = this.data.delActions;
    let TotalType = this.data.TotalType;
    let areas1 = new Set();
    let totalArea = [];
    // 设定删除之后的选择数组
    let selectStatus = [];
    let selectActions = [];

    for (let i = 0; i < planActions.length; i++) {
      for (let j = 0; j < delActions.length; j++) {
        if (planActions[i]._id === delActions[j]._id) {
          planActions[i].isSelected = false;
          console.log('要删除的动作记录', delActions[j]);
          for (let k = 0; k < planActions[i].trainGroups.length; k++) {
            // 要将动作和次数已经完成的置为空
            planActions[i].trainGroups[k].trainNumber = 0;
            planActions[i].trainGroups[k].trainWeight = 0;
            TotalGroup--;
            // 根据部位去设置已经完成的容量，种数初始化的时候就要去设置了
            // this.countArea();
          }
          planActions.splice(i, 1);
          TotalType -= 1;
        }
      }
    }

    // 删除了相应的数据之后，还要对统计数组进行处理
    for (let i = 0; i < planActions.length; i++) {
      areas1.add(planActions[i].actionArea);
      //修改选择动作的数组
      selectStatus[planActions[i]._id] = true;
      selectActions.push(planActions[i]);
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
      for (let j = 0; j < planActions.length; j++) {
        // 获取每个部位的动作的种类数
        if (planActions[j].actionArea === totalArea[i].area) {
          totalArea[i].areaType += 1;
        }
      }
    }
    this.setData({
      totalArea: totalArea,
      planActions: planActions,
      delActionsStatus: [],
      delActions: [],
      TotalType: TotalType,
      TotalGroup: TotalGroup
    })
  },
  // 添加组数事件
  addgroup(event) {
    //添加总组数
    let TotalGroup = this.data.TotalGroup;
    const index = event.currentTarget.dataset.index;
    let planActions = this.data.planActions;
    let addgroup = {
      trainWeight: '',
      trainNumber: '',
      trainRestTime: 30 * 1000,
    };
    planActions[index].trainGroups.push(addgroup);
    TotalGroup++;
    // 添加总组数
    console.log('要加组数的记录:', planActions[index].trainGroups);
    this.setData({
      planActions: planActions,
      TotalGroup: TotalGroup
    })
  },
  // 确认删除组数
  doDelGroups(event) {
    //添加总组数
    let TotalGroup = this.data.TotalGroup;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    let planActions = this.data.planActions;
    let trainGroups = planActions[index].trainGroups;
    // 删除下标为index1的组数
    trainGroups.splice(index1, 1);
    TotalGroup--;
    planActions[index].trainGroups = trainGroups;


    console.log('删除之后的组数', planActions[index].trainGroups);
    this.setData({
      planActions: planActions,
      TotalGroup: TotalGroup
    })
  },
  // 开启删除组数
  onDelGroups() {
    this.setData({
      delGroupsTag: !this.data.delGroupsTag
    })
  },
  //改变重量和容量事件
  // 输入重量完成后的监听事件
  onWeightConfirm(event) {

    let weight = event.detail.value;
    // 动作的下边index
    const index = event.currentTarget.dataset.index;
    // 动作组数的小标
    const index1 = event.currentTarget.dataset.index1;
    // 设置相应的重量到训练记录里
    let planActions = this.data.planActions;
    let trainGroups = planActions[index].trainGroups;

    trainGroups[index1].trainWeight = weight;
    planActions[index].trainGroups = trainGroups;

    this.setData({
      planActions: planActions,
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
    let planActions = this.data.planActions;
    let trainGroups = planActions[index].trainGroups;

    trainGroups[index1].trainNumber = number;
    planActions[index].trainGroups = trainGroups;

    this.setData({
      planActions: planActions,
    });
  },
  naviToTraining() {
    wx.navigateTo({
      url: '../Training/Training',
    })
  },
  onCollChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  // 获取训练计划
  getPlan() {
    let planActions = [];
    let trainingActions = app.globalData.trainingActions;
    let totalArea = [];
    let existAreas = [];
    let TotalGroup = this.data.TotalGroup;
    let areas = new Set();

    // 获取动作计划
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'getTrainPlan',
      success: res => {
        let result = res.result.data[0];
        planActions = result.planActions;
        totalArea = result.totalArea;
        TotalGroup= result.TotalGroup;
        // 如果本页中的planActions中已经存在该动作，则不需要再添加了
        for (let i = 0; i < planActions.length; i++) {
          for (let j = 0; j < trainingActions.length; j++) {

            if (planActions[i]._id == trainingActions[j]._id) {
              trainingActions.splice(j, 1);
            }
          }
        }

        for (let i = 0; i < trainingActions.length; i++) {
          TotalGroup ++;
          areas.add(trainingActions[i].actionArea);
          trainingActions[i].trainCount = 0;
          trainingActions[i].trainComplishCount = 0;
          trainingActions[i].trainGroups = [{
            // 训练备注
            trainReamark: '',
            trainWeight: '',
            trainNumber: '',
            trainRestTime: 30 * 1000,
            Complish: false
          }]
          trainingActions[i].date = this.data.date;
          trainingActions[i].maxCount = 0;
          trainingActions[i].maxWeight = 0;
        }
        // 获取统计中已经存在的部位
        for (let i = 0; i < totalArea.length; i++) {
          existAreas.push(totalArea[i].area);
        }
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
        planActions = planActions.concat(trainingActions);
        for (let i = 0; i < totalArea.length; i++) {
          totalArea[i].areaType = 0;
          for (let j = 0; j < planActions.length; j++) {
            // 获取每个部位的动作的种类数
            if (planActions[j].actionArea === totalArea[i].area) {
              totalArea[i].areaType += 1;
            }
          }
        }
        this.setData({
          planActions: planActions,
          TotalGroup:TotalGroup,
          TotalType: planActions.length,
          totalArea: totalArea,
          planName: result.planName
        })
        console.log('获取到的动作计划', this.data.totalArea);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.trainingActions.length) {
      this.getPlan();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlan();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
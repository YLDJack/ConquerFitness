// miniprogram/pages/addTemplateDisplay/addTemplateDisplay.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 动作详情弹出层
    showPopup:false,
    // 详情动作
    queryActionByName:[],
    planId: '',
    // 计划名称
    planName: '',
    // 计划动作列表
    trainRecord: [],
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
  onPopupClose(){
    this.setData({
      showPopup:false
    })
  },
  //修改计划名
  updatePlanName(event){
    this.setData({
      planName:event.detail.value
    })
  },
  // 保存训练计划
  savePlan() {
    wx.cloud.callFunction({
      name: 'updateTrainPlan',
      data: {
        planId: this.data.planId,
        planName: this.data.planName,
        trainRecord: this.data.trainRecord,
        TotalGroup: this.data.TotalGroup,
        TotalType: this.data.TotalType,
        totalArea: this.data.totalArea,
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: err =>{
        wx.showToast({
          title: '保存失败'+err,
          icon:'none'
        })
        console.log(err);
      }
    })
  },
  //开始训练
  beginTrain(){
    // 将训练记录设置为本动作的记录
    app.globalData.trainRecord = this.data.trainRecord;
    // 关闭当前页，直接跳转
    wx.navigateTo({
      url: '../Training/Training',
    })
  },
  // 添加动作跳转
  addAction() {
    this.setData({
      delTag: false
    })
    // 关闭当前页，直接跳转
    wx.navigateTo({
      url: '../ActionAdd/ActionAdd',
    })
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
  // 确认删除动作事件
  onDel() {
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
        if (trainRecord[i]._id === delActions[j]._id) {
          trainRecord[i].isSelected = false;
          console.log('要删除的动作记录', delActions[j]);
          for (let k = 0; k < trainRecord[i].trainGroups.length; k++) {
            // 要将动作和次数已经完成的置为空
            trainRecord[i].trainGroups[k].trainNumber = 0;
            trainRecord[i].trainGroups[k].trainWeight = 0;
            TotalGroup--;
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
        }
      }
    }
    this.setData({
      totalArea: totalArea,
      trainRecord: trainRecord,
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
    let trainRecord = this.data.trainRecord;
    let addgroup = {
      trainWeight: '',
      trainNumber: '',
      trainRestTime: 30 * 1000,
    };
    trainRecord[index].trainGroups.push(addgroup);
    TotalGroup++;
    // 添加总组数
    console.log('要加组数的记录:', trainRecord[index].trainGroups);
    this.setData({
      trainRecord: trainRecord,
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
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;
    // 删除下标为index1的组数
    trainGroups.splice(index1, 1);
    TotalGroup--;
    trainRecord[index].trainGroups = trainGroups;


    console.log('删除之后的组数', trainRecord[index].trainGroups);
    this.setData({
      trainRecord: trainRecord,
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
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;

    trainGroups[index1].trainWeight = weight;
    trainRecord[index].trainGroups = trainGroups;

    this.setData({
      trainRecord: trainRecord,
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
    let trainRecord = this.data.trainRecord;
    let trainGroups = trainRecord[index].trainGroups;

    trainGroups[index1].trainNumber = number;
    trainRecord[index].trainGroups = trainGroups;

    this.setData({
      trainRecord: trainRecord,
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
  getPlanById(planId) {
    let trainRecord = [];
    let trainingActions = app.globalData.trainingActions;
    let totalArea = [];
    let existAreas = [];
    let TotalGroup = this.data.TotalGroup;
    let areas = new Set();

    // 获取动作计划
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'getTrainPlanById',
      data:{
        planId:planId
      },
      success: res => {
        let result = res.result.data[0] || [];
        trainRecord = result.trainRecord || [];
        totalArea = result.totalArea || [];
        TotalGroup = result.TotalGroup || 0;
        // 如果本页中的trainRecord中已经存在该动作，则不需要再添加了
        for (let i = 0; i < trainRecord.length; i++) {
          for (let j = 0; j < trainingActions.length; j++) {

            if (trainRecord[i]._id == trainingActions[j]._id) {
              trainingActions.splice(j, 1);
            }
          }
        }

        for (let i = 0; i < trainingActions.length; i++) {
          TotalGroup++;
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
        this.setData({
          trainRecord: trainRecord,
          TotalGroup: TotalGroup,
          TotalType: trainRecord.length,
          totalArea: totalArea,
          planName: result.planName,
          planId:planId
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
      this.getPlanById(this.data.planId);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.planId);
    this.getPlanById(options.planId);
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
    // 添加计划页面隐藏时应当清空训练动作。
    app.globalData.trainingActions = [];
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
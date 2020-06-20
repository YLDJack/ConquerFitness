// pages/TrainTemplate/TrainTemplate.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainPlans: [],
    // 操作弹出层
    showPop: false,
    // 添加计划弹出层
    addPlanshow: false,
    // 添加计划中选择动作类型的折叠列表
    collactiveNames: ['0'],
    // 删除计划标记
    delPlanFlag: false,
    // 添加计划的弹出层
    showAddPop: false,
    // 要添加的动作的属性
    addPlanName: '',
    addPlanDesc: '',
    addPlanImageist: []
  },
  // 添加计划上传图片
  uploadImage(event) {
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '上传中...',
      duration: 0,
      loadingType: "circular"
    });
    const {
      file
    } = event.detail;
    console.log('图片加载完成', file);
    const filePath = file.path;
    const tempFlie = filePath.split('.')
    const cloudPath = 'planImage/' + 'planImage-' + tempFlie[tempFlie.length - 2] + '.' + tempFlie[tempFlie.length - 1]
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.cloud代表传到云开的数据库
    wx.cloud.uploadFile({
      filePath: filePath,
      cloudPath: cloudPath,
      success: res => {
        toast.clear();
        console.log('上传成功', res);
        // 上传完成需要更新 fileList
        var {
          fileList = []
        } = this.data;
        fileList.push({
          file,
          url: res.fileID
        });
        this.setData({
          addPlanImageist:fileList
        });
        console.log(this.data.addPlanImageist);
      }
    });
  },
  // 添加计划执行方法
  doAddPlan(){
    // 如果计划名为空提醒其输入用户名
    if (!this.data.addPlanName) {
      Toast.fail('请输入计划名');
      return false;
    }
    let addPlanImage = "";
    if (this.data.addPlanImageist[0]) {
      addPlanImage = this.data.addPlanImageist[0].url
    }else{
      // 若没上传图片，默认上传cfit的图片
      addPlanImage = 'cloud://conquercheck-geges.636f-conquercheck-geges-1301732640/ConquerFitness.png'
    }
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '上传中...',
      duration: 0,
      loadingType: "circular"
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addPlan',
      // 传给云函数的参数
      data: {
        addPlanName: this.data.addPlanName,
        addPlanDesc: this.data.addPlanDesc,
        addPlanImage:addPlanImage
      },
      success: res => {
        toast.clear();
        wx.showToast({
          title: '添加计划成功',
        })
        this.setData({
          // 上传成功后进行清空
          addPlanName: '',
          addPlanDesc: '',
          addPlanImageist:[]
        });
        // 每当页面加载的时候，根据当前左侧部位分类发起请求
        this.getPlan();
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '添加计划失败',
        })
      }
    })
  },
  onCollChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  // 展示更多操作弹出层
  showPopup() {
    this.setData({
      showPop: true
    });
  },
  addPlan() {
    this.setData({
      addPlanshow: true
    });
  },
  addPlanonClose() {
    this.setData({
      addPlanshow: false
    });
  },
  onClose() {
    this.setData({
      showPop: false
    });
  },
  // 开始删除操作
  startDelPlan() {
    this.setData({
      delPlanFlag: true,
      showPop: false
    })
  },
  // 取消删除操作
  cancelDel() {
    this.setData({
      delPlanFlag: false,
    })
  },
  // 删除计划事件
  doDelPlan(event) {
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'delTrainPlanById',
      data: {
        planid: event.currentTarget.dataset.planid
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.getPlan();
      }
    })
  },
  // 添加计划页面跳转
  startAddPlan() {
    this.setData({
      showPop: false,
      showAddPop: true
    })
  },
  // 关闭添加计划页面
  onAddClose() {
    this.setData({
      showAddPop: false
    })
  },

  // 点击模板跳转到traing页面，但是顶部添加备注位置读取了模板宫格中的text
  addTemplate() {

  },

  templateTraining() {
    wx.navigateTo({
      url: '../addTemplateDisplay/addTemplateDisplay',
    })
  },
  // 点击计划
  clickPlan(event) {
    wx.navigateTo({
      url: '../addTemplateDisplay/addTemplateDisplay?planId=' + event.currentTarget.dataset.planid,
    })
  },

  // 获取训练计划
  getPlan() {
    // 获取动作计划
    wx.cloud.callFunction({
      // 云函数名称，获取本人的所有动作记录
      name: 'getTrainPlan',
      success: res => {
        let result = res.result.data;
        this.setData({
          trainPlans: result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPlan();
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
import dayjs from '../../utils/dayjs/index';
import utils from '../../utils/util'
import duration from '../../utils/dayjs/plugin/duration/index';
require('../../utils/dayjs/locale/zh-cn');
dayjs.locale('zh-cn');
dayjs.extend(duration);

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: '男',
    todayStep: 1000,
    // 最新的身体数据
    trainState: "增肌",
    // 修改前的状态
    originState: '增肌',
    weight: 50,
    fat: 15,
    ass: 50,
    leg: 30,
    smallleg: 20,
    breast: 20,
    arms: 20,
    waist: 32,
    // 目标体重
    targetWeight: 45,
    cutWeight: 0,
    // 离目标还剩多少体重
    leaveWeight: 0,
    // 目标完成百分比
    circleValue: 0,
    // 状态开始的第几天
    targetDay: 0,
    // 目标体重日期
    targetDate: '',
    // 初始体重
    originWeight: 50,
    // 记录初始体重的日期
    originWeightDate: '',
    // 前十年到今天的日期选择器内容
    currentDate: new Date().getTime(),
    miniDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    // tab
    active: 0,
    activeNames: ['0'],
    // 体重下拉面板中数据
    weightcollapse: ['w'],
    gradientColor: {
      '0%': 'rgb(63, 236, 255)',
      '100%': 'rgb(132, 114, 248)',
    },
    showweight: false,
    date: "",
    InitialWeight: false,
    TargetWeight: false,
    // 体脂下拉计算面板
    fatcollapse: ['0'],
    sexvalue: '',
    showfattip: false,
    // 围度下拉面板
    circlecollapse: ['0'],
    ChestLine: false,
    ArmLine: false,
    WaistLine: false,
    HitLine: false,
    HamLine: false,
    CalfLine: false,
    // 训练状态的显示
    showstatu: false,
    // 训练状态列表
    columns: ['增肌', '减脂', '塑形']
  },
  // 更新目标
  async onUpdateTarget() {
    let trainState = this.data.trainState;
    let targetWeight = this.data.targetWeight;
    let weight = this.data.weight;
    // 如果目标状态是增肌则目标体重必须大于当前体重,如果是减脂或塑形则目标体重必须小于当前体重
    if (trainState === '增肌') {

      if (weight > targetWeight) {
        wx.showToast({
          title: '增肌的目标体重应该大于当前体重',
          icon: 'none'
        })
        targetWeight = weight + 1;
      }
    } else {

      if (weight < targetWeight) {
        wx.showToast({
          title: '目标重量应该小于当前体重',
          icon: 'none'
        })
        targetWeight = weight - 1;
      }
    }
    if (this.data.originState === this.data.trainState) {
      await wx.cloud.callFunction({
        // 云函数名称
        name: 'updatePersonalData',
        // 传给云函数的参数
        data: {
          date: this.data.date,
          trainState: this.data.trainState,
          weight: this.data.weight,
          fat: this.data.fat,
          ass: this.data.ass,
          leg: this.data.leg,
          smallleg: this.data.smallleg,
          breast: this.data.breast,
          arms: this.data.arms,
          waist: this.data.waist,
          targetWeight: targetWeight,
          // 目标开始时间
          targetStartTime: this.data.originWeightDate,
          // 目标时间
          targetEndTime: this.data.targetDate,
          // 训练目标没有改变，则原始体重也不变
          originWeight: this.data.originWeight,
          originWeightDate: this.data.originWeightDate,
          sex: this.data.sex,
          todayStep: this.data.todayStep
        },
        success: async res => {

          wx.showToast({
            title: '更新成功',
          })
          this.getDataFromCloud();

        },
        fail: error => {

          console.log(error);
          wx.showToast({
            title: '更新失败',
            icon: "none"
          })
        }
      })
    } else {
      // 如果修改了训练状态，则将当天的体重设置为该训练时间段的原始体重,当天的设置为原始时间和目标开始时间
      await wx.cloud.callFunction({
        // 云函数名称
        name: 'updatePersonalData',
        // 传给云函数的参数
        data: {
          date: this.data.date,
          trainState: this.data.trainState,
          weight: this.data.weight,
          fat: this.data.fat,
          ass: this.data.ass,
          leg: this.data.leg,
          smallleg: this.data.smallleg,
          breast: this.data.breast,
          arms: this.data.arms,
          waist: this.data.waist,
          targetWeight: targetWeight,
          // 目标开始时间
          targetStartTime: this.data.date,
          // 目标时间
          targetEndTime: this.data.targetDate,
          // 训练目标改变，则原始体重设置为当天的体重
          originWeight: this.data.weight,
          originWeightDate: this.data.date,
          sex: this.data.sex,
          todayStep: this.data.todayStep
        },
        success: async res => {

          wx.showToast({
            title: '更新成功',
          })

          this.getDataFromCloud();
        },
        fail: error => {

          console.log(error);
          wx.showToast({
            title: '更新失败',
            icon: "none"
          })
        }
      })
    }

    this.setData({
      TargetWeight: false
    })
  },
  // 从云端获取数据的方法
  async getDataFromCloud() {
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'getPersonalData',
      success: res => {
        let length = res.result.data.length;
        wx.showToast({
          title: '获取个人数据成功',
        });
        app.globalData.bodydata = res.result.data[length - 1];
        app.globalData.bodydatas = res.result.data;
        console.log("身体数据:", app.globalData.bodydata);
        this.setRecordData();
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
  // 保存体脂数据
  saveFat() {
    onUpdateTarget();
  },
  onChangeTab(event) {
    wx.showToast({
      title: `切换到${event.detail.title}`,
      icon: 'none',
    });
  },

  // 体重下拉面板
  onChangeWeightCard(event) {
    this.setData({
      weightcollapse: event.detail,
    });
  },

  // 改变体重时的调用方法
  onChange_Weight(event) {
    this.setData({
      weight: event.detail
    })
  },
  // 弹出体重选择
  showPopup_weight() {
    this.setData({
      showweight: true
    });
  },
  // 关闭体重选择器
  onClose_weight() {
    this.setData({
      showweight: false
    });
  },
  onSureWeight() {
    this.onUpdateTarget();
    this.setData({
      showweight: false
    });
  },
  // 目标体重编辑
  editTargetWeight() {
    this.setData({
      TargetWeight: true
    });
  },
  onCloseTargetWeight() {
    this.setData({
      TargetWeight: false
    });
  },
  onChangeTargetWeight(event) {
    this.setData({
      targetWeight: event.detail
    })
  },
  // 初始体重编辑
  editInitialWeight() {
    this.setData({
      InitialWeight: true
    });
  },
  onCloseInitialWeight() {
    this.setData({
      InitialWeight: false
    });
  },
  onChangeInitialWeight(event) {
    this.setData({
      InitialWeight: event.detail
    })
  },

  // 体脂下拉计算面板
  onChangeFatCard(event) {
    this.setData({
      fatcollapse: event.detail,
    });
  },

  onChangeSex(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },

  // 选择锻炼状态
  showPopup_statu() {
    this.setData({
      showstatu: true
    });
  },
  onpickerCancel() {
    this.setData({
      showstatu: false
    })
  },
  // 确认训练状态
  onpickerConfirm(event) {
    const {
      value
    } = event.detail;

    this.setData({
      trainState: value,
      showstatu: false
    })
  },
  // 体脂范围提示
  showfatpopup() {
    this.setData({
      showfattip: true
    });
  },

  onCloseFattip() {
    this.setData({
      showfattip: false
    });
  },

  // 围度下拉面板change事件
  onChangecircCard(event) {
    this.setData({
      circlecollapse: event.detail,
    });
  },

  // 胸围编辑
  editChestLine() {
    this.setData({
      ChestLine: true
    });
  },

  onCloseChestLine() {
    this.setData({
      ChestLine: false
    });
  },

  onChangeChestLine(event) {
    this.setData({
      breast: event.detail
    })
  },

  // 臂围编辑
  editArmLine() {
    this.setData({
      ArmLine: true
    });
  },

  onCloseArmLine() {
    this.setData({
      ArmLine: false
    });
  },

  onChangeArmLine(event) {
    this.setData({
      arms: event.detail
    })
  },

  // 腰围编辑
  editWaistLine() {
    this.setData({
      WaistLine: true
    });
  },

  onCloseWaistLine() {
    this.setData({
      WaistLine: false
    });
  },

  onChangeWaistLine(event) {
    this.setData({
      waist: event.detail
    })
  },

  // 臀围编辑
  editHitLine() {
    this.setData({
      HitLine: true
    });
  },

  onCloseHitLine() {
    this.setData({
      HitLine: false
    });
  },

  onChangeHitLine(event) {
    this.setData({
      ass: event.detail
    })
  },

  // 大腿围编辑
  editHamLine() {
    this.setData({
      HamLine: true
    });
  },

  onCloseHamLine() {
    this.setData({
      HamLine: false
    });
  },

  onChangeHamLine(event) {
    this.setData({
      leg: event.detail
    })
  },

  // 小腿围编辑
  editCalfLine() {
    this.setData({
      CalfLine: true
    });
  },

  onCloseCalfLine() {
    this.setData({
      CalfLine: false
    });
  },

  onChangeCalfLine(event) {
    this.setData({
      smallleg: event.detail
    })
  },

  // 曲线日历按钮挑战数据图表页面
  onClickUpload() {
    this.onUpdateTarget();
  },

  // 日期选择器弹出层
  showDatePopup() {
    this.setData({
      showDatePicker: true
    });
  },

  onCloseDatePicker() {
    this.setData({
      showDatePicker: false
    });
  },
  // 饮食记录页前十年到今天的日期选择器
  onInputDate(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  // 饮食记录下拉面板
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 目标日期时间选择器完成触发方法
  onConfirmTargetDate(event) {
    let date = utils.formatDate(new Date(event.detail));
    console.log(date);
    this.setData({
      targetDate: date,
      showDatePicker: false
    })
  },
  // 目标日期时间选择器取消触发方法
  onCancelTargetDate(event) {
    this.setData({
      showDatePicker: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setRecordData();
  },
  setRecordData() {
    // 获取性别和每日步数
    let todayStep = app.globalData.todayStep;
    let sex = app.globalData.sex;
    let nowRecord = app.globalData.bodydata;
    let date = app.globalData.date;
    let originWeightDate = nowRecord.originWeightDate;
    // 计算是该状态的第几天
    let a = dayjs(date, 'YYYY-MM-DD');
    let b = dayjs(originWeightDate, 'YYYY-MM-DD');
    let targetDay = dayjs.duration(a.diff(b)).days() + 1;
    console.log(targetDay);
    let nowWeight = nowRecord.weight;
    let targetWeight = nowRecord.targetWeight;
    let originWeight = nowRecord.originWeight;
    // 计算离目标还剩多少体重
    let leaveWeight = Math.abs(nowWeight - targetWeight).toFixed(1);
    // 计算原始体重和目标体重总共相差多少
    let totalNeed = Math.abs(targetWeight - originWeight).toFixed(1);
    let cutWeight = Math.abs(totalNeed - leaveWeight).toFixed(1);
    // 计算意见减去的体重占全部需要减去的体重的百分比
    let circleValue = 100 - Math.abs(cutWeight / totalNeed).toFixed(2) * 100;
    console.log('circleValue', circleValue);
    this.setData({
      sex: sex,
      todayStep: todayStep,
      cutWeight: cutWeight,
      circleValue: circleValue,
      totalNeed: totalNeed,
      leaveWeight: leaveWeight,
      originState: nowRecord.trainState,
      targetDay: targetDay,
      date: date,
      sexvalue: sex,
      originWeight: nowRecord.originWeight,
      originWeightDate: nowRecord.originWeightDate,
      trainState: nowRecord.trainState,
      weight: nowRecord.weight,
      fat: nowRecord.fat,
      ass: nowRecord.ass,
      leg: nowRecord.leg,
      smallleg: nowRecord.smallleg,
      breast: nowRecord.breast,
      arms: nowRecord.arms,
      waist: nowRecord.waist,
      targetWeight: nowRecord.targetWeight,
      targetDate: nowRecord.targetEndTime,
    })
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
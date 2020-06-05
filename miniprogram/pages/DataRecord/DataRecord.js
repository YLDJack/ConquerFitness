
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 前十年到今天的日期选择器内容
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
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
    weightcircle: 50,
    gradientColor: {
      '0%': 'rgb(63, 236, 255)',
      '100%': 'rgb(132, 114, 248)',
    },
    showweight: false,
    date: "",
    weight: 50,
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
    CalfLine: false
  },

  onChangeTab(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
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
  // 目标体重编辑
  editTargetWeight() {
    this.setData({
      TargetWeight: true
    });
  },
  onCloseTargetWeight() {
    this.setData({ TargetWeight: false });
  },
  onChangeTargetWeight(event) {
    this.setData({
      TargetWeight: event.detail
    })
  },
  // 初始体重编辑
  editInitialWeight() {
    this.setData({
      InitialWeight: true
    });
  },
  onCloseInitialWeight() {
    this.setData({ InitialWeight: false });
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

  // 体脂范围提示
  showfatpopup() {
    this.setData({ showfattip: true });
  },

  onCloseFattip() {
    this.setData({ showfattip: false });
  },

  // 围度下拉面板change事件
  onChangecircCard(event) {
    this.setData({
      circlecollapse: event.detail,
    });
  },

  // 胸围编辑
  editChestLine(){
    this.setData({
      ChestLine: true
    });
  },

  onCloseChestLine(){
    this.setData({
      ChestLine: false
    });
  },

  onChangeChestLine(event) {
    this.setData({
      ChestLine: event.detail
    })
  },

  // 臂围编辑
  editArmLine(){
    this.setData({
      ArmLine: true
    });
  },

  onCloseArmLine(){
    this.setData({
      ArmLine: false
    });
  },

  onChangeArmLine(event) {
    this.setData({
      ArmLine: event.detail
    })
  },

  // 腰围编辑
  editWaistLine(){
    this.setData({
      WaistLine: true
    });
  },

  onCloseWaistLine(){
    this.setData({
      WaistLine: false
    });
  },

  onChangeWaistLine(event) {
    this.setData({
      WaistLine: event.detail
    })
  },

  // 臀围编辑
  editHitLine(){
    this.setData({
      HitLine: true
    });
  },

  onCloseHitLine(){
    this.setData({
      HitLine: false
    });
  },

  onChangeHitLine(event) {
    this.setData({
      HitLine: event.detail
    })
  },

  // 大腿围编辑
  editHamLine(){
    this.setData({
      HamLine: true
    });
  },

  onCloseHamLine(){
    this.setData({
      HamLine: false
    });
  },

  onChangeHamLine(event) {
    this.setData({
      HamLine: event.detail
    })
  },

  // 小腿围编辑
  editCalfLine(){
    this.setData({
      CalfLine: true
    });
  },

  onCloseCalfLine(){
    this.setData({
      CalfLine: false
    });
  },

  onChangeCalfLine(event) {
    this.setData({
      CalfLine: event.detail
    })
  },

  // 曲线日历按钮挑战数据图表页面
  onClickLinebtn(){
    wx.navigateTo({
      url: '../Personal_data/Personal_data',
    })
  },

  // 日期选择器弹出层
  showDatePopup() {
    this.setData({ showDatePicker: true });
  },

  onCloseDatePicker() {
    this.setData({ showDatePicker: false });
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
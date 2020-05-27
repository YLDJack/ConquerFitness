import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: [
      { text: '选择反馈类型', value: 0 },
      { text: 'BUG反馈', value: 1 },
      { text: '功能建议', value: 2 },
      { text: '其他', value: 3 }
    ],
    optionValue: 0,
    messageValue: '',
    contactValue: '',
    // 上传图片预览
    fileList: []
  },
  
  // 反馈信息
  onChange_message(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      messageValue: event.detail
    })
  },
  // 联系方式
  onChange_contact(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      contactValue: event.detail
    })
  },

  uploadImage(event) {
    Toast.loading({
      mask: true,
      message: '加载中...'
    });
    const {
      file
    } = event.detail;
    console.log('图片加载完成', file);
    const filePath = file.path;
    const tempFlie = filePath.split('.')
    const cloudPath = 'feedbackImage/' + 'feedbackimage-' + tempFlie[tempFlie.length - 2] + '.' + tempFlie[tempFlie.length - 1]
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.cloud代表传到云开的数据库
    wx.cloud.uploadFile({
      filePath: filePath,
      cloudPath: cloudPath,
      success: res => {
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
          fileList
        });
        console.log(this.data.fileList);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onAddFeedback: function (){
    // 如果反馈信息为空提醒其输入反馈信息
    if (!this.data.messageValue) {
      Toast.fail('请输入反馈信息');
      return false;
    }
    if (this.data.optionValue === 0) {
      Toast.fail('请选择反馈类型');
      return false;
    }
    console.log(this.data.messageValue);
    let addFeedbackImage = "";
    if (this.data.fileList){
      addFeedbackImage = this.data.fileList;
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addFeedBack',
      // 传给云函数的参数
      data: {
        optionText: this.data.optionValue.text,
        messageValue: this.data.messageValue,
        contactValue: this.data.contactValue,
        feedbackImage: addFeedbackImage
      },
      success: res => {
        wx.showToast({
          title: '提交成功',
        })
        this.setData({
          optionValue: 0,
          messageValue: "",
          contactValue: "",
          fileList:[]
        })
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '提交失败',
        })
      }
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
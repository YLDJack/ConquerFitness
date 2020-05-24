//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "conquercheck-geges",
      traceUser: true,
    })
  }
})
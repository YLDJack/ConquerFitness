const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "../../pages/Main/Main",
        iconPath: "/image/icon_component.png",
        selectedIconPath: "/image/icon_component_HL.png",
        text: "首页",
        isSpecial: false
      }, {
        pagePath: "../../pages/Train/Train",
        iconPath: "/image/icon_yalin.png",
        selectedIconPath: "/image/icon_yalin_selected.png",
        text: "动作",
        isSpecial: false
      },
      {
        pagePath: "/pages/Training/Training",
        iconPath: "/image/icon_train_selected.png",
        selectedIconPath: "/image/icon_train_selected.png",
        text: "训练",
        isSpecial: true
      },
      {
        pagePath: "../../pages/Count/Count",
        iconPath: "/image/icon_tubiao.png",
        selectedIconPath: "/image/icon_tubiao_selected.png",
        text: "统计",
        isSpecial: false
      },
      {
        pagePath: "../../pages/Personal/Personal",
        iconPath: "/image/icon_personal.png",
        selectedIconPath: "/image/icon_personal_selected.png",
        text: "我的",
        isSpecial: false
      }
    ],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const dataset = e.currentTarget.dataset
      const path = dataset.path
      const index = dataset.index
      //如果是特殊跳转界面
      if (this.data.list[index].isSpecial) {
        wx.navigateTo({
          url: path
        })
      } else {
        //正常的tabbar切换界面
        wx.switchTab({
          url: path
        })
        this.setData({
          selected: index
        })
      }
    }
  }
})
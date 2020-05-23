// pages/Train/Train.js'
// import toast from '../../node_modules/@vant/weapp/dist/toast/toast';
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

//初始化折线图的方法
function initlineChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['胸部', '背部', '腿部'],
      top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '胸部',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: '背部',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: '腿部',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // // 获取的actionname
    // actionName:"",
    // 根据动作获取结果
    queryActionByName: [],
    // 一个部位中所有动作的查询结果
    queryActionByArea: [],
    // 根据相应的部位和分类获取动作的数组结果
    actionByAreaCate: [],
    // 右侧页面中的分类数组
    actionCate: [],
    // 分类部位当前选中的值
    catevalue: 0,
    // 分类类型
    cateOption: [{
        text: '按器材',
        value: 0
      },
      {
        text: '按侧重',
        value: 1
      }
    ],
    // treeselect--左侧选中项的索引属性
    mainActiveIndex: 0,
    // treeselect--右侧选中项的 id，支持传入数组
    activeId: [],
    // 左边选择项items 数据结构
    items: [{
        // 导航名称
        text: '胸部',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '背部',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '肩部',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '手臂',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '大腿',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '小腿',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '核心',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '臀部',
        // 禁用选项
        disabled: false,
      },
      {
        // 导航名称
        text: '有氧',
        // 禁用选项
        disabled: false,
      }
    ],
    // 评价分数
    starvalue: 3,
    searchText: "",
    slideKey: 0,
    //展示动作界面
    showText: false,
    //展示添加动作界面
    showAddPop: false,
    // 添加动作界面弹出层coll默认选中数值
    collactiveNames: ['0'],
    collactiveNames1: ['1'],
    lineec: {
      onInit: initlineChart
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 每当页面加载的时候，根据当前左侧部位分类发起请求
    this.onQueryActionByArea();
  },
  // 根据锻炼部位查询数据
  //根据动作名查询数据，并显示弹出动作详细框
  onQueryActionByArea() {
    const actionArea = this.data.items[this.data.mainActiveIndex].text;
    console.log(actionArea);
    wx.cloud.init();
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('actions').where({
      actionArea: actionArea
    }).get({
      success: res => {
        this.setData({
          queryActionByArea: res.data
        });
        console.log('[查询记录] 成功:', this.data.queryActionByArea);
        // 查询获取到数据中存在的分类
        this.QueryCate();
        this.onQueryActionByAreaCate();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  // 根据分类类别来获取分类
  QueryCate() {
    const cate = this.data.cateOption[this.data.catevalue].text
    console.log(cate);
    const data = this.data.queryActionByArea;
    const length = data.length;
    let cateSet = new Set();
    if (cate === "按侧重") {
      // 获取训练部位名
      for (let i = 0; i < length; i++) {
        cateSet.add(data[i].actionSub);
      }
    } else {
      // 获取动作的装备名
      for (let i = 0; i < length; i++) {
        cateSet.add(data[i].actionEquipment);
      }
    }
    let catedata = Array.from(cateSet);
    this.setData({
      actionCate: catedata
    })
    console.log("共有类：", this.data.actionCate);
  },
  // 根据传递来的分类来处理获取到的部位数据
  onQueryActionByAreaCate() {
    // 获取到的分部数据
    const areadata = this.data.queryActionByArea;
    // 获取分类
    const cate = this.data.actionCate;

    const length = areadata.length;
    console.log(length);
    // 分类后的数据
    var catedata = {};
    for (let i = 0; i < cate.length; i++) {
      // 动态地给catedata对象添加以分类命名的键
      catedata[cate[i]] = [];
      console.log(catedata[cate[i]]);
      for (let j = 0; j < length; j++) {
        if (cate[i] === areadata[j].actionEquipment) {
          catedata[cate[i]].push(areadata[j]);
        }
      }
    }
    this.setData({
      actionByAreaCate: catedata
    });
    console.log('分类后的数据:', this.data.actionByAreaCate);
  },
  // treeselect的左侧点击方法
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
    // 由于选择不同的部位，所以重新进行查询
    this.onQueryActionByArea();
  },
  //根据动作名查询数据，并显示弹出动作详细框
  showPopup: function (event) {
    console.log(event);
    // dataset中的数据必须为全部小写才能获取
    const actionName = event.currentTarget.dataset.actionname;
    console.log(actionName);
    wx.cloud.init();
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('actions').where({
      actionName: actionName
    }).get({
      success: res => {
        this.setData({
          showText: true,
          queryActionByName: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.queryActionByName)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  // // 从云数据库查询动作
  // async onQueryAction() {
  //   wx.cloud.init();
  //   const db = wx.cloud.database()        this.onQueryActionByAreaCate("徒手");
  //   // 查询当前用户所有的 counters
  //   await db.collection('actions').get({
  //     success: res => {
  //       this.setData({
  //         queryActionResult: res.data
  //       })
  //       console.log('[数据库] [查询记录] 成功: ', this.data.queryActionResult)
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     }
  //   })
  // },
  //treeselect 左侧导航点击方法 

  // 添加动作跳转事件
  showAdd() {
    this.setData({
      showAddPop: true
    });
  },
  onAddClose() {
    this.setData({
      showAddPop: false
    });
  },
  onCollChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  onCollChange1(event) {
    this.setData({
      collactiveNames1: event.detail
    });
  },
  //星星评分的点击事件
  onStarChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  onClose() {
    this.setData({
      showText: false
    });
  },
  // 侧边栏点击监听事件
  onSlideChange(event) {
    console.log("点击了侧边栏")
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('设置选中项 1')
      this.getTabBar().setData({
        selected: 1
      })
    }
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

  },
})
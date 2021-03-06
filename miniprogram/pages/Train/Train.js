import * as echarts from '../../ec-canvas/echarts';
import Toast from '@vant/weapp/toast/toast'
const app = getApp();

Page({

  //页面的初始数据
  data: {
    // 要删除数据的_id
    delArray: [],
    // 被选中的item
    delstatus: [],
    // 批量删除
    delbutton: false,
    // 弹出层里的tab索引
    moretabactive: 0,
    // 更新的动作
    updateActionName: "",
    updateActionDesc: "",
    updateActionNote: "",
    updateActionType: "",
    updateActionEqu: "",
    updateActionSub: "",
    updateActionArea: "",
    updateActionImage: "",
    currentTab: '',
    // 是否编辑动作标签
    updateTag: false,
    // 上传图片列表
    fileList: [],
    updatefileList: [],
    // 添加的动作名称
    addActionName: "",
    addActionDesc: "",
    addActionNote: "",
    // 选择动作的类型
    addActionType: "力量训练1",
    addActionEqu: "杠铃",
    // 添加动作的训练侧重
    addActionSub: "",
    // 添加动作的训练部位
    addActionArea: "胸部",
    // 选择动作部位的ts
    areaItems: [{
        // 导航名称
        text: '胸部',
        children: [{
            // 名称
            text: '胸大肌',
            // id，作为匹配选中状态的标识
            id: 1,
          },
          {
            text: '上胸大肌',
            id: 2
          }, {
            text: '前锯肌',
            id: 3
          }
        ]
      },
      {
        // 导航名称
        text: '背部',
        children: [{
            // 名称
            text: '背阔肌',
            // id，作为匹配选中状态的标识
            id: 4,
          },
          {
            text: '大圆肌',
            id: 5
          }, {
            text: '菱形肌',
            id: 6
          },
          {
            text: '冈下肌',
            id: 7
          }
        ]
      },
      {
        // 导航名称
        text: '肩部',
        children: [{
            // 名称
            text: '三角肌前束',
            // id，作为匹配选中状态的标识
            id: 8,
          },
          {
            // 名称
            text: '三角肌中束',
            // id，作为匹配选中状态的标识
            id: 9,
          },
          {
            // 名称
            text: '三角肌后束',
            // id，作为匹配选中状态的标识
            id: 10,
          },
          {
            // 名称
            text: '斜方肌',
            // id，作为匹配选中状态的标识
            id: 11,
          },
        ]
      },
      {
        // 导航名称
        text: '手臂',
        children: [{
            // 名称
            text: '肱二头肌',
            // id，作为匹配选中状态的标识
            id: 12,
          },
          {
            // 名称
            text: '肱三头肌',
            // id，作为匹配选中状态的标识
            id: 13,
          },
          {
            // 名称
            text: '肱肌',
            // id，作为匹配选中状态的标识
            id: 14,
          }
        ]
      },
      {
        // 导航名称
        text: '核心',
        // 禁用选项
        children: [{
            // 名称
            text: '腹直肌',
            // id，作为匹配选中状态的标识
            id: 15,
          },
          {
            // 名称
            text: '腹外斜肌',
            // id，作为匹配选中状态的标识
            id: 16,
          },
          {
            // 名称
            text: '竖脊肌',
            // id，作为匹配选中状态的标识
            id: 17,
          }
        ]
      },
      {
        // 导航名称
        text: '腿部',
        children: [{
            // 名称
            text: '股四头肌',
            // id，作为匹配选中状态的标识
            id: 18,
          },
          {
            // 名称
            text: '股二头肌',
            // id，作为匹配选中状态的标识
            id: 19,
          },
          {
            // 名称
            text: '小腿肌群',
            // id，作为匹配选中状态的标识
            id: 20,
          }
        ]
      },

      {
        // 导航名称
        text: '臀部',
        children: [{
            // 名称
            text: '臀大肌',
            // id，作为匹配选中状态的标识
            id: 21,
          },
          {
            // 名称
            text: '臀中肌',
            // id，作为匹配选中状态的标识
            id: 22,
          }
        ]
      }
    ],
    areaIndex: 0,
    areaActiveId: null,
    updateareaIndex: 0,
    updateareaActiveId: null,
    // 搜索结果
    queryActionBySearch: [],
    // 根据openid获取的添加的动作
    queryAddActions: [],
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
    // more弹出层里的ts的索引
    addpopActiveIndex: 0,
    // treeselect--右侧选中项的 id，支持传入数组
    activeId: [],
    // more弹出层里的ts的选中id数组
    addpopactiveId: [],
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
        text: '腿部',
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
    //搜索的内容
    searchText: "",
    // 评价分数
    starvalue: 3,
    slideKey: 0,
    //展示动作界面
    showText: false,
    //展示添加动作界面
    showAddPop: false,
    // 添加动作界面弹出层coll默认选中数值
    collactiveNames: ['0'],
    updatecollactiveNames: ['0'],
    lineec: {
      lazyLoad: true, // 延迟加载
    },
    showCharts: false,
    // 肌容量图数据
    countSeries: [{
      data: [],
      smooth: false,
      // 圆圈的大小
      symbol: 'circle',
      symbolSize: 10,
      type: 'line',
      // 设置始终显示数据
      itemStyle: {
        normal: {
          label: {
            color: 'lightred',
            // 设置单位
            show: true, //开启显示
            position: 'top', //在上方显示
          }
        }
      },
      // 显示最大值最小值以及平均值
      markPoint: {
        data: [{
            type: 'max',
            name: '最大值',
            symbolSize: 40,

          },
          {
            type: 'min',
            name: '最小值',
            symbolSize: 40
          }
        ]
      },
      // 设置平均值的线
      markLine: {
        label: {
          show: true,
          position: 'end'
        },
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    }, ],
    // 肌容量坐标x轴
    countAscissaData: [],
  },
  //初始化容量图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height, dpr) => {
      // 初始化图表,init中的第二个参数可以设置主题颜色
      const Chart = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  // 获取容量eharts设置数据
  getOption: function () {
    var that = this
    var option = {
      legend: {
        data: ['肌容量'],
        bottom: 0,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      // 刻度
      grid: {
        containLabel: true
      },
      dataZoom: [{
        type: 'inside',
        throttle: 50
      }],
      // 指定表的标题
      title: {
        show: true,
        text: '容量变化折线图',
        left: 'center',
      },
      xAxis: {
        //坐标轴名字 name:'日期',
        // nameLocation:'center',
        type: 'category',
        boundaryGap: false,
        data: that.data.countAscissaData.reverse(),
        onZero: true,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: { //y轴坐标是否显示
          show: true
        },
        axisTick: { //y轴刻度小标是否显示
          show: true
        }
      },
      series: that.data.countSeries
    }
    return option
  },
  // 获取容量折线图数据
  getChartData: function (actionId) {
    console.log('接收到的actionid', actionId);
    let countSeries = this.data.countSeries;
    // 处理好的横坐标
    let countAscissaData = [];
    // 根据动作id和open_id获取动作记录数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getActionRecordById',
      // 传给云函数的参数
      data: {
        actionId: actionId
      },
      success: res => {
        wx.showToast({
          title: '获取动作数据成功',
        })
        let result = res.result.data

        // 容量的数值
        let ydata = [];

        //将动作记录的时间设置为x轴
        for (let i = 0; i < result.length; i++) {
          ydata.push(result[i].trainCount);
          countAscissaData.push(result[i].date);
        }
        countSeries[0].data = ydata.reverse();
        this.setData({
          countSeries: countSeries,
          countAscissaData: countAscissaData,
          showCharts: true,
          currentTab: 1
        });
        console.log('获取到的动作记录', this.data.countSeries);
        this.echartsComponnet = this.selectComponent('#mychart-dom-line');
        // this.echartsComponnet.canvasNode._height = 550;
        // this.echartsComponnet.canvasNode._width = 550;
        console.log(this.echartsComponnet);
        this.init_echarts();

      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: '获取动作数据失败',
          icon: "none"
        })
      }
    });
  },
  // tab的切换方法
  onTabChange(event) {
    if (event.detail.name === 1) {

      this.getChartData(event.currentTarget.dataset.actionid);
    }
  },
  // 确认删除
  shouldDel() {
    // 发起云函数请求
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '批量删除中...',
      duration: 0,
      loadingType: "circular"
    });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delmultiPersonalDatas',
      // 传给云函数的参数
      data: {
        // 将要删除的数据传给云函数
        delArray: this.data.delArray
      },
      success: res => {
        toast.clear();
        wx.showToast({
          title: '批量删除成功',
        })
        this.setData({
          // 删除完后将选中数组和删除id的数组都置为空
          delArray: [],
          delstatus: []
        });
        // 并且重新要发起查询请求
        this.onQueryActionByArea();
        // 若查询的获得的数据为空则将编辑按钮退回原来的状态
        if (this.data.queryAddActions.length === 0) {
          this.setData({
            delbutton: false
          })
        }
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '批量删除失败失败',
        })
      }
    })
  },
  // 点击要删除的item
  onDelItemClick(event) {
    // 使用set确保每个id都是不重复的
    let delindex = event.currentTarget.dataset.index;
    let delstatus = this.data.delstatus;
    let newdel = new Set(this.data.delArray);
    // 判断是否已经被选中，如果已经被选中，则将其变为未选中。
    if (delstatus[delindex]) {
      delstatus[delindex] = false;
      newdel.delete(event.currentTarget.dataset.id);
    } else {
      delstatus[delindex] = true;
      newdel.add(event.currentTarget.dataset.id);
    }
    newdel = Array.from(newdel);
    this.setData({
      delArray: newdel,
      delstatus: delstatus
    })
    console.log('要删除的index', this.data.delstatus);
    console.log('删除动作的id', this.data.delArray);
  },
  // 开始批量删除
  startDel() {
    this.setData({
      delbutton: !this.data.delbutton,
      // 将选中的动作置为空
      delstatus: []
    })
  },
  // 选择运动类型按钮
  selectType(event) {
    let type = event.target.dataset.type;
    this.setData({
      addActionType: type
    })
  },
  // 更新动作时选择运动类型按钮
  selectType1(event) {
    let type = event.target.dataset.type;
    this.setData({
      updateActionType: type
    })
  },
  selectEqu(event) {
    this.setData({
      addActionEqu: event.target.dataset.equ
    })
  },
  selectEqu1(event) {
    this.setData({
      updateActionEqu: event.target.dataset.equ
    })
  },
  // 添加动作选择部位的左侧导航按钮
  onAreaClickNav({
    detail = {}
  }) {
    // 根据下标获取部位
    let area = this.data.areaItems[detail.index].text;
    // 若左侧改变时则同时改变右边的文本
    let sub = this.data.areaItems[detail.index].children[0].text
    this.setData({
      areaIndex: detail.index || 0,
      addActionArea: area,
      addActionSub: sub
    });
  },
  // 添加动作选择部位的右侧导航按钮
  onAreaClickItem({
    detail = {}
  }) {
    const areaActiveId = this.data.areaActiveId === detail.id ? null : detail.id;

    this.setData({
      areaActiveId: areaActiveId,
      addActionSub: detail.text
    });
  },
  // 更新动作选择部位的左侧导航按钮
  onupdateAreaClickNav({
    detail = {}
  }) {
    // 根据下标获取部位
    let area = this.data.areaItems[detail.index].text;
    // 若左侧改变时则同时改变右边的文本
    let sub = this.data.areaItems[detail.index].children[0].text
    this.setData({
      updateareaIndex: detail.index || 0,
      updateActionArea: area,
      updateActionSub: sub
    });
  },
  // 更新动作选择部位的右侧导航按钮
  onupdateAreaClickItem({
    detail = {}
  }) {
    const areaActiveId = this.data.areaActiveId === detail.id ? null : detail.id;

    this.setData({
      updateareaActiveId: areaActiveId,
      updateActionSub: detail.text
    });
  },
  // 添加自定义动作事件
  onAddAction() {
    // 如果动作名为空提醒其输入用户名
    if (!this.data.addActionName) {
      Toast.fail('请输入动作名');
      return false;
    }
    console.log(this.data.addActionName);
    let addActionImage = "";
    if (this.data.fileList[0]) {
      addActionImage = this.data.fileList[0].url
    } else {
      // 若没上传图片，默认上传cfit的图片
      addActionImage='cloud://conquercheck-geges.636f-conquercheck-geges-1301732640/zwtp.png'
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
      name: 'actionAdd',
      // 传给云函数的参数
      data: {
        actionName: this.data.addActionName,
        actionDesc: this.data.addActionDesc,
        actionNote: this.data.addActionNote,
        // 选择动作的类型
        actionType: this.data.addActionType,
        actionEqu: this.data.addActionEqu,
        // 添加动作的训练侧重
        actionSub: this.data.addActionSub,
        // 添加动作的训练部位
        actionArea: this.data.addActionArea,
        // 将训练图片的url当做参数传递，若为空则置空
        actionImage: addActionImage
      },
      success: res => {
        toast.clear();
        wx.showToast({
          title: '添加成功',
        })
        this.setData({
          moretabactive: 1,
          // 将所有输入都清空
          addActionName: "",
          addActionDesc: "",
          addActionNote: "",
          fileList: [],
          addActionType: "力量训练1",
          addActionEqu: "杠铃",
          addActionSub: "",
          areaActiveId: null
        });
        // 每当页面加载的时候，根据当前左侧部位分类发起请求
        this.onQueryActionByArea();
      },
      fail: error => {
        toast.clear();
        console.log(error);
        wx.showToast({
          title: '添加失败',
        })
      }
    })
  },
  // 编辑动作开关
  onUpdate() {
    this.setData({
      updateTag: !this.data.updateTag
    })
  },
  confirmDesc(event) {
    const index = event.currentTarget.dataset.index
    console.log('当前输入的描述:', index, event.detail);
    let desc = this.data.updateActionDesc;
    desc[index] = event.detail;
    this.setData({
      updateActionDesc: desc
    })
  },
  confirmNote(event) {
    const index = event.currentTarget.dataset.index
    console.log('当前输入的重点:', index, event.detail);
    let note = this.data.updateActionNote;
    note[index] = event.detail;
    this.setData({
      updateActionNote: note
    })
  },
  // 编辑自定义动作
  updateAddAction(event) {
    if (!this.data.updateActionName) {
      wx.showToast({
        title: '用户名不能为空!',
        icon: "none"
      })
      return false;
    }
    const delid = event.currentTarget.dataset.delid;
    console.log("要编辑的动作ID是：", delid);
    let updateActionImage = this.data.updateActionImage;
    if (this.data.updatefileList[0]) {
      updateActionImage = this.data.updatefileList[0].url
    }
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '同步中...',
      duration: 0,
      loadingType: "circular"
    });
    // 调用云函数查询动作
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateAddAction',
      // 传给云函数的参数
      data: {
        _id: delid,
        actionName: this.data.updateActionName,
        actionDesc: this.data.updateActionDesc,
        actionNote: this.data.updateActionNote,
        // 选择动作的类型
        actionType: this.data.updateActionType,
        actionEqu: this.data.updateActionEqu,
        // 添加动作的训练侧重
        actionSub: this.data.updateActionSub,
        // 添加动作的训练部位
        actionArea: this.data.updateActionArea,
        // 将训练图片的url当做参数传递，若为空则置空
        actionImage: updateActionImage
      },
    }).
    then(res => {
      toast.clear();
      wx.showToast({
        icon: 'none',
        title: '更新记录成功'
      });
      this.onQueryActionByArea();
      // 如果当前在搜索界面，则重新发起搜索
      if (this.data.searchText) {
        this.setData({
          queryActionBySearch: []
        })
        this.onSearch();
      }
      this.setData({
        updateTag: false,
        updateActionImage: updateActionImage,
        updatefileList: [],

        showText: false
      })
    }).
    catch(err => {
      toast.clear();
      wx.showToast({
        icon: 'none',
        title: '更新记录失败'
      })
      console.error('更新自定义动作失败：', err)
    })
  },
  closeItem() {
    this.setData({
      updatefileList: [],
      showText: false,
      updateTag: false
    })
  },

  // 添加图片
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
    const cloudPath = 'actionImage/' + 'actionimage-' + tempFlie[tempFlie.length - 2] + '.' + tempFlie[tempFlie.length - 1]
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
          fileList
        });
        console.log(this.data.fileList);
      }
    });
  },
  // 修改自定义动作时添加图片
  uploadImage1(event) {
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
    const cloudPath = 'actionImage/' + 'actionimage-' + tempFlie[tempFlie.length - 2] + '.' + tempFlie[tempFlie.length - 1];
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.cloud代表传到云开的数据库
    wx.cloud.uploadFile({
      filePath: filePath,
      cloudPath: cloudPath,
      success: res => {
        toast.clear(),
          console.log('上传成功', res);
        // 上传完成需要更新 fileList
        var {
          updatefileList = []
        } = this.data;
        updatefileList.push({
          file,
          url: res.fileID
        });
        this.setData({
          updatefileList
        });
        console.log(this.data.updatefileList);
      }
    });
  },
  // 根据锻炼部位查询数据
  //根据动作名查询数据，并显示弹出动作详细框
  async onQueryActionByArea() {
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      duration: 0,
      loadingType: "circular"
    });

    const actionArea = this.data.items[this.data.mainActiveIndex].text;
    console.log(actionArea);
    await this.onQueryAddActions(actionArea);
    // 调用云函数查询动作
    wx.cloud.callFunction({
      // 云函数名称
      name: 'queryActionByArea',
      // 传给云函数的参数
      data: {
        queryactionArea: actionArea
      }
    }).
    then(res => {
      toast.clear();
      var actions = res.result.data;
      actions = actions.concat(this.data.queryAddActions);
      console.log('所有动作:', actions);
      this.setData({
        queryActionByArea: actions
      });
      // 查询获取到数据中存在的分类
      this.QueryCate();
      this.onQueryActionByAreaCate();
    }).catch(err => {
      toast.clear();
      wx.showToast({
        icon: 'none',
        title: '查询所有动作失败'
      })
      console.error('所有动作失败：', err)
    })
  },
  // 查询自定义动作动作
  async onQueryAddActions(actionArea) {
    // const actionArea = this.data.items[this.data.mainActiveIndex].text;
    // 调用云函数查询动作
    await wx.cloud.callFunction({
      // 云函数名称
      name: 'queryAddAction',
      // 传给云函数的参数
      data: {
        queryactionArea: actionArea
      }
    }).
    then(res => {
      this.setData({
        queryAddActions: res.result.data
      });
      console.log('添加的自定义动作:', res.result.data);
    }).
    catch(err => {
      wx.showToast({
        icon: 'none',
        title: '查询自定义动作失败'
      })
      console.error('查询自定义动作失败：', err)
    })
  },
  // 删除自定义动作
  delAddAction(event) {
    const toast = Toast.loading({
      mask: true,
      forbidClick: true, // 禁用背景点击
      message: '删除中...',
      duration: 0,
      loadingType: "circular"
    });
    const delid = event.currentTarget.dataset.delid;
    console.log("要删除的动作ID是：", delid);
    // 调用云函数查询动作
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delAction',
      // 传给云函数的参数
      data: {
        delid: delid
      }
    }).
    then(res => {
      toast.clear();
      console.log(delid, '删除成功');
      this.onQueryActionByArea();
      // 如果当前在搜索界面，则重新发起搜索
      if (this.data.searchText) {
        this.setData({
          queryActionBySearch: []
        })
        this.onSearch();
      }
      // 删除成功后关闭界面
      this.setData({
        showText: false
      });
    }).catch(err => {
      toast.clear();
      wx.showToast({
        icon: 'none',
        title: '删除记录失败'
      })
      console.error('删除记录失败：', err)
    })
  },
  // 根据分类类别来获取分类
  QueryCate() {
    const cate = this.data.cateOption[this.data.catevalue].text
    console.log(cate);
    const data = this.data.queryActionByArea;
    const length = data.length;
    let cateSet = new Set();
    if (cate == "按侧重") {
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
    let catedata = {};
    for (let i = 0; i < cate.length; i++) {
      // 动态地给catedata对象添加以分类命名的键
      catedata[cate[i]] = [];
      for (let j = 0; j < length; j++) {
        // 判断是按器材还是按部位
        if (this.data.cateOption[this.data.catevalue].text === "按器材") {
          if (cate[i] === areadata[j].actionEquipment) {
            catedata[cate[i]].push(areadata[j]);
          }
        } else {
          if (cate[i] === areadata[j].actionSub) {
            catedata[cate[i]].push(areadata[j]);
          }
        }
      }
    }
    this.setData({
      actionByAreaCate: catedata
    });
    console.log('分类后的数据:', this.data.actionByAreaCate);
  },
  // 首页treeselect的左侧点击方法,切换部位方法
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
      // 切换分类时将搜索栏都置为空
      searchText: "",
      queryActionBySearch: [],
      queryAddActions: [],
      queryActionByArea: []
    });
    // 由于选择不同的部位，所以重新进行查询
    this.onQueryActionByArea();
  },
  // 弹出层的ts的左侧导航点击事件
  onaddClickNav({
    detail = {}
  }) {
    this.setData({
      addpopActiveIndex: detail.index || 0,
      queryAddActions: []
    });
    const actionArea = this.data.items[this.data.addpopActiveIndex].text;
    this.onQueryAddActions(actionArea);
  },
  onSearch(event) {
    if (event) {
      this.setData({
        searchText: event.detail.trim()
      })
    }
    const searchText = this.data.searchText;
    if (!searchText) {
      this.setData({
        queryActionBySearch: []
      })
      return true;
    }
    const data = this.data.queryActionByArea;
    const length = data.length;
    console.log(searchText)
    let searchaction = [];
    for (let i = 0; i < length; i++) {
      // 针对输入框进行模糊搜索
      if (data[i].actionName.indexOf(searchText) >= 0 && searchText) {
        searchaction.push(data[i])
      }
    }
    this.setData({
      queryActionBySearch: searchaction
    })
    console.log(this.data.queryActionBySearch);
  },
  // 分类发生变化的情况
  onCateChange(value) {
    if (this.data.catevalue == 0) {
      this.setData({
        catevalue: 1
      })
    } else {
      this.setData({
        catevalue: 0
      })
    }
    console.log(this.data.cateOption[this.data.catevalue].text);
    this.QueryCate();
    this.onQueryActionByAreaCate();
  },
  //根据动作名查询数据，并显示弹出动作详细框
  showPopup: function (event) {
    // dataset中的数据必须为全部小写才能获取
    const id = event.currentTarget.dataset.id;
    const data = event.currentTarget.dataset.querydata;
    const length = data.length;
    let catedata = [];
    for (let i = 0; i < length; i++) {
      if (id === data[i]._id) {
        catedata.push(data[i]);
      }
    }
    this.setData({
      queryActionByName: catedata,
      showText: true,
      updateActionName: catedata[0].actionName,
      updateActionDesc: catedata[0].actionDesc,
      updateActionNote: catedata[0].actionNote,
      updateActionType: catedata[0].actionType,
      updateActionEqu: catedata[0].actionEquipment,
      updateActionSub: catedata[0].actionSub,
      updateActionArea: catedata[0].actionArea,
      updateActionImage: catedata[0].actionImage
    })
    console.log("当前的动作是:", this.data.queryActionByName);
  },
  // 添加动作跳转事件
  showAdd() {
    this.setData({
      showAddPop: true,
    });
  },
  onAddClose() {
    this.setData({
      showAddPop: false,
      delbutton: false
    });
  },
  onCollChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  onCollChange1(event) {
    this.setData({
      updatecollactiveNames: event.detail
    });
  },
  //星星评分的点击事件
  onStarChange(event) {
    this.setData({
      collactiveNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 每当页面加载的时候，根据当前左侧部位分类发起请求
    this.onQueryActionByArea();
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
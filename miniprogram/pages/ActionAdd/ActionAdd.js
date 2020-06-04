// import * as echarts from '../../ec-canvas/echarts';
import Toast from '@vant/weapp/toast/toast'
const app = getApp();


Page({

  //页面的初始数据
  data: {
    // 选中状态
    selectStatus: [],
    // 选中的动作
    selectActions: [],
    // 更新的动作
    updateActionName: "",
    updateActionDesc: "",
    updateActionNote: "",
    updateActionType: "",
    updateActionEqu: "",
    updateActionSub: "",
    updateActionArea: "",
    updateActionImage: "",
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
    // 添加动作界面弹出层coll默认选中数值
    collactiveNames: ['0'],
    updatecollactiveNames: ['0']
  },
  // 添加动作按钮
  doAddActions() {
    app.globalData.trainingActions = this.data.selectActions;
    wx.navigateTo({
      url: '../Training/Training',
    })
  },
  // 选择动作按钮
  selsectActions(event) {
    let id = event.currentTarget.dataset.id;
    let selectAction = this.data.selectActions;
    let selectStatus = this.data.selectStatus;
    let actionByAreaCate = this.data.actionByAreaCate;
    let actionCate = this.data.actionCate;
    // 如果已经选中则置isSelected为false
    if (selectStatus[id] === true) {
      selectStatus[id] = false;
      // 否则则置isSelected为true
      for (let i = 0; i < actionCate.length; i++) {
        for (let j = 0; j < actionByAreaCate[actionCate[i]].length; j++) {
          if (actionByAreaCate[actionCate[i]][j]._id === id) {
            actionByAreaCate[actionCate[i]][j].isSelected = false;
            var index = selectAction.indexOf(actionByAreaCate[actionCate[i]][j])
            selectAction.splice(index, 1);

          }
        }
      }
    } else {
      selectStatus[id] = true;
      // 否则则置isSelected为true
      for (let i = 0; i < actionCate.length; i++) {
        for (let j = 0; j < actionByAreaCate[actionCate[i]].length; j++) {
          if (actionByAreaCate[actionCate[i]][j]._id === id) {
            actionByAreaCate[actionCate[i]][j].isSelected = true;
            selectAction.push(actionByAreaCate[actionCate[i]][j]);
          }
        }
      }
    }
    app.globalData.selectActions = selectAction;
    app.globalData.selectStatus = selectStatus;
    this.setData({
      actionByAreaCate: actionByAreaCate,
      selectActions: selectAction,
      selectStatus: selectStatus
    })
    console.log('选择的动作是：', this.data.selectActions);
    console.log('选择的动作状态：', this.data.selectStatus);
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
    // 如果用户名为空提醒其输入用户名
    if (!this.data.addActionName) {
      Toast.fail('请输入用户名');
      return false;
    }
    console.log(this.data.addActionName);
    let addActionImage = "";
    if (this.data.fileList[0]) {
      addActionImage = this.data.fileList[0].url
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
    await wx.cloud.callFunction({
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
       // 如果全局变量中已经存在了，选择数组，则直接将其赋值给本页面的选择数组
      if (app.globalData.selectActions && app.globalData.selectStatus) {
        // 同时要遍历分类好的数据，设置它的isSelected
        let actionByAreaCate = this.data.actionByAreaCate;
        let actionCate = this.data.actionCate;
        for (let i = 0; i < app.globalData.selectActions.length; i++) {
          // 否则则置isSelected为true
          for (let j = 0; j < actionCate.length; j++) {
            for (let z = 0; z < actionByAreaCate[actionCate[j]].length; z++) {
              if (actionByAreaCate[actionCate[j]][z]._id === app.globalData.selectActions[i]._id) {
                actionByAreaCate[actionCate[j]][z].isSelected = true;
              }
            }
          }
        }
        this.setData({
          actionByAreaCate: actionByAreaCate,
          selectActions: app.globalData.selectActions,
          selectStatus: app.globalData.selectStatus
        })
        console.log('原先已有的动作:', app.globalData.selectActions);
        console.log('原先已有的选择状态:', app.globalData.selectStatus);
      }
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
  onClose() {
    this.setData({
      showText: false
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
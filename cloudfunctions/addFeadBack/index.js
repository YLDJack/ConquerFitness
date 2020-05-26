// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {


  const openId = cloud.getWXContext().OPENID;
  return await db.collection('actionsAdd').add({
    data: {
      // event和小程序端传参的参数一致
      openId: openId,
      actionArea: event.actionArea,
      actionDesc: event.addactionDesc,
      actionEquipment: event.actionEqu,
      actionImage: event.actionImage,
      actionName: event.actionName,
      actionNote: event.addactionNote,
      actionSub: event.actionSub,
      actionType: event.actionType,
    }
  })
}
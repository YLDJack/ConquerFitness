// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;
  let addactionNote = event.actionNote;
  let addactionDesc = event.actionDesc;
  return await db.collection('actionsAdd').where({
    _id: event._id,
    openId: openId
  }).update({
    data: {
      actionArea: event.actionArea,
      actionDesc: addactionDesc,
      actionEquipment: event.actionEqu,
      actionImage: event.actionImage,
      actionName: event.actionName,
      actionNote: addactionNote,
      actionSub: event.actionSub,
      actionType: event.actionType,
    }
  })
}
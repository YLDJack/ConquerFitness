// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('actionRecords').add({
    data: {
      openId:openId,
      actionId: event.actionId,
      actionName: event.actionName,
      trainCount:event.trainCount,
      maxCount: event.maxCount,
      maxWeight: event.maxWeight,
      date: event.date,
      trainGroups:event.trainGroups
    }
  })
}
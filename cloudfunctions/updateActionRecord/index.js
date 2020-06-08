// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('actionRecords').where({
    date: event.date,
    actionId: event.actionId,
    openId: openId
  }).update({
    data: {
      trainCount:event.trainCount,
      actionName: event.actionName,
      maxCount: event.maxCount,
      maxWeight: event.maxWeight,
    }
  })
}
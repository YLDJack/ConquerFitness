// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('trainPlan').where({
    _id: event.planId,
    openId: openId
  }).update({
    data: {
      planName: event.planName,
      planName: event.planNamet,
      trainRecord: event.trainRecord,
      TotalGroup: event.TotalGroup,
      TotalType: event.TotalType,
      totalArea: event.totalArea,
    }
  })
}
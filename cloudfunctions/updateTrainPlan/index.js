// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  return await db.collection('trainPlan').where({
    _id: event.planId,
  }).update({
    data: {
      planName: event.planName,
      trainRecord: event.trainRecord,
      TotalGroup: event.TotalGroup,
      TotalType: event.TotalType,
      totalArea: event.totalArea,
    }
  })
}
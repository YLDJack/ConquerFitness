// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('trainedRecords').add({
    data: {
      openId: openId,
      date: event.date,
      trainRecord: event.trainRecord,
      TrainMark: event.TrainMark,
      TotalType: event.TotalType,
      TotalGroup: event.TotalGroup,
      TotalCount: event.TotalCount,
      totalArea: event.totalArea,
    }
  })
}
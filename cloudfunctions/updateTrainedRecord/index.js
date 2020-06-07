// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('trainedRecords').where({
    date: event.date,
    openId: openId
  }).update({
    data: {
      trainRecord: event.trainRecord
    }
  })
}
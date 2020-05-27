// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;

  return await db.collection('PersonalData').where({
    openId: openId
  }).update({
    data: {
      openId: openId,
      trainState: event.trainState,
      weight: event.weight,
      fat: event.fat,
      ass: event.ass,
      leg: event.leg,
      smallleg: event.smallleg,
      breast: event.breast,
      arms: event.arms,
    }
  })
}
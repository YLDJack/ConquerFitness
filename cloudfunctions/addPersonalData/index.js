// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 请不要在 exports.main 外使用 getWXContext，此时尚没有调用上下文，无法获取得到信息。
  let openId = cloud.getWXContext().OPENID;
  return await db.collection('PersonalData').add({
    data: {
      openId: openId || event.openid,
      date: event.date,
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
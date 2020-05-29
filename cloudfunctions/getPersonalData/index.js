// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let openID = cloud.getWXContext().OPENID;
  // 按照时间升序排列
  return await db.collection('PersonalData').where({
    openId: openID || event.openId
  }).orderBy('date', 'asc').get()
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;
  try {
    return await db.collection('trainPlan').where({
      openId:openId,
      _id: event.planid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;
  const _ = db.command;
  try {
    return await db.collection('actionsAdd').where({
      openId:openId,
      // 判断id是否在要删除的id数组中
      _id:_.in(event.delArray)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
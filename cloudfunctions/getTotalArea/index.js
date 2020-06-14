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
  // 等待其查询完再进行部位查询
  return await db.collection('trainedRecords').where({
    openId: openId
  }).field({
    totalArea:true,
    _id:true,
    date:true
  }).get()
}
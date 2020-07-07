// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const $ = db.command.aggregate;
  // 获取当前时间
  let startDate = event.startDate;
  // 获取本周结束的时间
  let endDate = event.endDate;
  const openId = cloud.getWXContext().OPENID;
  const _ = db.command;
  // 等待其查询完再进行部位查询
  return await db.collection('trainedRecords').where(_.and([{
      // 大于等于开始的时间
      date: _.gte(startDate)
    },
    // 小于等于结束的时间
    {
      date: _.lte(endDate)
    },
    {
      openId: openId
    }
  ])).field({
    trainRecord: true,
    _id: false,
    totalArea: true,
    TotalType: true,
    TotalGroup: true,
    TotalCount: true
  }).get()
}
// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const $ = db.command.aggregate;
  // 获取当前时间
  let dateNow = new Date(event.dateNow);
  // 获取本周结束的时间
  let weekEnd = new Date(event.weekEnd);
  // 将时间转换为json格式
  const dateNowJson = dayjs(dateNow).format('YYYY-MM-DD'),
    weekEndJson = dayjs(weekEnd).format('YYYY-MM-DD')
  const openId = cloud.getWXContext().OPENID;

  const _ = db.command;

  // 等待其查询完再进行部位查询
  return await db.collection('trainedRecords').where(_.and([
    {
      date: _.gte(dateNowJson)
    },
    {
      date: _.lte(weekEndJson)
    },
    {
      openId: openId
    }
  ]))
  .field({
    _id: '$_id',
    date: '$date',
    totalArea: '$totalArea',
  })
  .get()
}
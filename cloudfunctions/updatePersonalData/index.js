// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();





// 云函数入口函数
exports.main = async (event, context) => {
  let openID = cloud.getWXContext().OPENID;

  const res = await cloud.callFunction({
    // 调用获取记录的云函数
    name: 'getPersonalData',
    data: {
      openId: openID
    }
  });

  // 获取当前数据表的数据信息
  let personalData = res.result.data;
  let length = res.result.data.length;
  console.log('获取到的数据', personalData);

  for (let i = 0; i < length; i++) {
    if (event.date === personalData[i].date) {
      // 若已有数据中存在当前日期的数据，则直接进行更新。否则则新添加一条记录。
      return await db.collection('PersonalData').where({
        openId: openID,
        date: event.date
      }).update({
        data: {
          openId: openID,
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
  }
  return await cloud.callFunction({
    // 调用添加数据的云函数
    name: 'addPersonalData',
    data: {
      openid: openID,
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
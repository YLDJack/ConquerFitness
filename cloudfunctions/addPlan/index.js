// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const openId = cloud.getWXContext().OPENID;
  return await db.collection('trainPlan').add({
    data: {
      openId: openId,
      planName: event.addPlanName,
      planDesc: event.addPlanDesc,
      planImage: event.addPlanImage,
      TrainMark: '',
      TotalGroup:0,
      TotalType:0,
      TotalCount:0,
      totalArea:[],
      trainRecord:[]
    }
  })
}
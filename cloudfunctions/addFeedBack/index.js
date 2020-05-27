// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {


  const openId = cloud.getWXContext().OPENID;
  return await db.collection('Feedback').add({
    data: {
      // event和小程序端传参的参数一致
      openId: openId,
      optionText: event.optionText,
      messageValue: event.messageValue,
      contactValue: event.contactValue,
      feedbackImage: event.feedbackImage,
    }
  })
}
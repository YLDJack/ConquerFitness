// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const actionsCollection = db.collection('actions')
// 云函数入口函数
exports.main = async (event, context) => {
  return await actionsCollection.add({
    data:{
      动作名称:"上斜杠铃推举",
      动作容量:"0",
      训练部位1:"胸部",
      训练部位2:"胸,三头,三角肌前束",
      器材分类:"杠铃",
      自定义:"null"
    }
  }) 
}
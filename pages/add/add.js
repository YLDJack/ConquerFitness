wx.cloud.init()
const db = wx.cloud.database()
const actionsCollection = db.collection('actions')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  addData:function(event){
    wx.cloud.callFunction({
      name:'addData'
    }).then(res =>{
      console.log(res)
    })
  }
  })




  //addData:function(event){
  // console.log(event)
    //productsCollection.add({
      //data:{
       //title:"Prodoct 3",
      // image:"https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E8%A5%BF%E7%93%9C&step_word=&hs=0&pn=6&spn=0&di=57970&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=3003214581%2C1877819773&os=3787123207%2C3039963499&simid=3453814009%2C376365937&adpicid=0&lpn=0&ln=1554&fr=&fmq=1589521273440_R&fm=&ic=undefined&s=undefined&hd=undefined&latest=undefined&copyright=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&ist=&jit=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fstatic.qizuang.com%2Fupload%2Feditor%2Fimage%2F20150629%2F20150629110552_73229.png&fromurl=ippr_z2C%24qAzdH3FAzdH3Fhwg2zity7wg8da_z%26e3Bv54AzdH3F%25Ec%25Ab%25bC%25Em%25AC%25la%25EE%25l0%25lD%25El%25la%25Ab%25Ec%25bB%25AB%25Ec%25B9%25b9%25Em%25BE%25Bm%25D8%25bn%25Ec%25A0%25lB%25El%25bF%25b8%25Ec%25Aa%25lC%25E0%25AC%25bC%25Em%25Bc%25An%25Em%25BB%25bc%25Em%25lc%25A9AzdH3F&gsm=7&rpstart=0&rpnum=0&islist=&querylist=&force=undefined",
      // tags:["tag4","tag3"],
      // price:10.12,
      // color:'yellow'
     // },
    //  success:res=>{
    //    console.log(res)
   //   }
  /*  })
  }
})*/
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	host: 'https://laravel7.test/api/v1/',
    userInfo: {},
	phone:'17600381130'

  },
  //事件处理函数
  onLoad: function () {

  },
  onShow:function(){

  },
  getCode:function(){
	  wx.request({
	    url: this.data.host+'weapp/verificationCodes',
	    method: 'POST',
		data:{
			phone: this.data.phone
		},
	    success : (res) =>{
			console.log(res)
	    },
	  			fail: (res) =>{
	  				wx.showModal({
	  				    title: '失败',
	  				    content: '刷新BearToken失败'
	  				  })
	  			}
	  })
  },
  getPhone:function(e){
	  this.setData({
		  phone:e.detail.value
	  })
  }

 
  })

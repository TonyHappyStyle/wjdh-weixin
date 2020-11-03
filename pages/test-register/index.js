//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	host: 'https://tc.mg.cool/api/v1/',
    userInfo: {},
	phone:'17600381130',
	verificationKey: '',
	verificationCode: '1234',
	expired_at:'',
	password:'123456',
	usercode: ''

  },
  //事件处理函数
  onLoad: function () {

  },
  onShow:function(){

  },
  getCodeKey:function(){
	  wx.request({
	    url: this.data.host+'weapp/verificationCodes',
	    method: 'POST',
		data:{
			phone: this.data.phone
		},
	    success : (res) =>{
			console.log(res)
			this.setData({
				verificationKey:res.data.key,
				expired_at:res.data.expired_at
			})
			
	    },
		fail: (res) =>{
			wx.showModal({
				title: '失败',
				content: '获取验证码失败'
			  })
		}
	  })
  },
  getPhone:function(e){
	  this.setData({
		  phone:e.detail.value
	  })
  },
  getPassword:function(e){
	 this.setData({
		 password:e.detail.value
	 })  
  },
  getCode:function(e){
	  this.setData({
		  verificationCode: e.detail.value
	  })
  },
  getWeixinCode:function(e){
  	  // 登录
  	  wx.login({
  	    success: res => {
  	      // 发送 res.code 到后台换取 openId, sessionKey, unionId
  		  console.log(res)
  		  this.setData({
  			  usercode : res.code
  		  })
      return res.code
  		  console.log(this.data.usercode)
  	    }
  	  })
  },
  register:function(e){
	  wx.request({
	    url: this.data.host+'weapp/users',
	    method: 'POST',
	  		data:{
	  			password: this.data.password,
				verification_key: this.data.verificationKey,
				verification_code: this.data.verificationCode,
				code: this.data.usercode
				
	  		},
	    success : (res) =>{
	  			console.log(res)
	  			
	    },
	  		fail: (res) =>{
	  			wx.showModal({
	  				title: '失败',
	  				content: '获取验证码失败'
	  			  })
	  		}
	  })
  }

 
  })

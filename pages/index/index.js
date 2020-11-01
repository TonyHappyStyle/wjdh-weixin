//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	host: 'http://laravel7.test/api/v1/',
    userInfo: {},
	usercode: '',
	bearToken: '',
	new_username: 'tonyhappystyle@163.com',
	new_password:'secret',
	
  },
  //事件处理函数
  onLoad: function () {
	
  },
  getUserInfo: function(e) {
    console.log(e)
  },
  getCode:function(e){
	  // 登录
	  wx.login({
	    success: res => {
	      // 发送 res.code 到后台换取 openId, sessionKey, unionId
		  console.log(res)
		  this.setData({
			  usercode : res.code
		  })
		  console.log(this.data.usercode)
	    }
	  })
  },
  //input获取未绑定的新登录用户名
  getNewUsername:function(e){
	  this.setData({
		  new_username : e.detail.value
	  })
  },
  getNewPassword:function(e){
	  this.setData({
		  new_password: e.detail.value
	  })
  },
  //input获取已绑定的登录用户名
  getOldUsername:function(e){
  	  this.setData({
  		  old_username : e.detail.value
  	  })
  },
  getOldPassword:function(e){
  	  this.setData({
  		  old_password: e.detail.value
  	  })
  },
  oldLogin:function(){
	  
  },
  newLogin:function(){
	  let code = this.data.usercode
	  if(!code){
		      wx.showModal({
		        title: '提示',
		        content: '还没请求code'
		      })
	  }
	  wx.request({
		  url: this.data.host+'weapp/authorizations',
		  method: 'POST',
		  data: {
			  code: code,
			  username: this.data.new_username,
			  passowrd: this.data.new_passowrd
		  },
		  header:{'content-type':'application/json'},
		  dataType: 'json',
		  responseType: 'text',
		  success : (res) =>{
			  console.log(res.data)
			  if(res.data.access_token)
			  {
				  this.setData({
				  bearToken: res.data.access_token
				})
				  //保存 token 和过期时间，然后返回
				  const accessToken = res.data.access_token
				  const accessTokenExpiredAt = new Date().getTime() + res.data.expires_in * 1000
		  
				  wx.setStorageSync('access_token', accessToken)
				  wx.setStorageSync('access_token_expired_at', accessTokenExpiredAt)
			  }
			  
			  
		  },
		  fail: (res) =>{
			  console.log('杨哲')
		  }
	  })
  }
  
})

// pages/test-login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: 'https://tc.mg.cool/api/v1/',
    phone: '17600381130',
    verification_key: '',
    phoneCode: '1234',
    usercode:''
  },
  onLoad:function(){
  },
  getUserCode:function(e){
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
  getCode: function(){
    wx.request({
      url: this.data.host+'verificationCodes/phone',
      method: 'POST',
    data:{
    	phone: this.data.phone
    },
      success : (res) =>{
    	console.log(res)
        this.setData({
          verification_key: res.data.key
        })
      },
    fail: (res) =>{
      console.log(res)
    	wx.showModal({
    		title: '失败',
    		content: '获取验证码失败'
    	  })
    }
    })
  },
  inputCode: function(e){
    this.setData({
      phoneCode:e.detail.value
    })
  },
  toLogin: function(){
    wx.request({
      url: this.data.host+'athorizations/phone',
      method: 'put',
    data:{
    	verification_key: this.data.verification_key,
      verification_code: this.data.phoneCode,
      code: this.data.usercode
    },
      success : (res) =>{
    	console.log(res)

      },
    fail: (res) =>{
      console.log(res)
    	wx.showModal({
    		title: '失败',
    		content: '登录失败'
    	  })
    }
    })
  }

})

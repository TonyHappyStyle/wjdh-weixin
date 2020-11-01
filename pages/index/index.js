//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	host: 'https://tc.mg.cool/api/v1/',
    userInfo: {},
	usercode: '',
	BearToken:'',
	new_username: 'tonyhappystyle@163.com',
	new_password:'secret',
  storage_accessToken: '',
  storage_expired_at: ''

  },
  //事件处理函数
  onLoad: function () {

  },
  onShow:function(){
    // 从缓存中取出 Token
    this.setData({
      storage_accessToken : wx.getStorageSync('access_token'),
      storage_expired_at : wx.getStorageSync('access_token_expired_at')
    })
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
      return res.code
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

  newLogin:function(){

	  let code = this.data.usercode
	  if(!code){
		   return   wx.showModal({
		        title: '提示',
		        content: '还没请求code'
		      })
	  }

    console.log(this.data.host+'weapp/authorizations')
	  wx.request({
		  url: this.data.host+'weapp/authorizations',
		  method: 'POST',
		  data: {
			  code: code,
			  username: this.data.new_username,
			  password: this.data.new_password
		  },
		  header:{'content-type':'application/json'},
		  dataType: 'json',
		  responseType: 'text',
		  success : (res) =>{
			  console.log(res.data)
        if(res.data.access_token){
           this.setData({
				  BearToken: res.data.access_token,
			  })
			  //保存 token 和过期时间，然后返回
			  const accessToken = res.data.access_token
			  const accessTokenExpiredAt = new Date().getTime() + res.data.expires_in * 1000

			  wx.setStorageSync('access_token', accessToken)
			  wx.setStorageSync('access_token_expired_at', accessTokenExpiredAt)
        this.setData({
          storage_accessToken : wx.getStorageSync('access_token'),
          storage_expired_at : wx.getStorageSync('access_token_expired_at')
        })
        wx.showModal({
            title: '成功',
            content: '已经成功登录，并保存了BearToken'
          })
        }else{
          wx.showModal({
              title: '提示',
              content: '不好意思,登录按钮必须手动点击生成code'
            })
        }

		  },
      fail:(res) => {
        wx.showModal({
            title: 'testfail',
            content: 'testfail'
          })
      }
	  })
  },
  // getCode:function(){
  //    // 登录
	 //  wx.login({
	 //    success: res => {
  //     return res.code
	 //    }
	 //  })
  // },
  refreshToken:function(){
      // 从缓存中取出 Token
      const accessToken = wx.getStorageSync('access_token')
      const expiredAt = wx.getStorageSync('access_token_expired_at')

      // 如果 token 过期了，则调用刷新方法
      if (accessToken && new Date().getTime() > expiredAt) {

        try {
          wx.request({
            url: this.data.host+'authorizations/current',
            method: 'put',
            data: {
          	  code: this.getCode,
          	  username: this.data.new_username,
          	  password: this.data.new_password
            },
             header: {
                  'Authorization': 'Bearer ' + this.data.BearToken
                },
            success : (res) =>{
          	  console.log(res.data)
          	  this.setData({
          		  BearToken: '刷新'+res.data.access_token
          	  })
          	  //保存 token 和过期时间，然后返回
          	  let accessToken = res.data.access_token
          	  let accessTokenExpiredAt = new Date().getTime() + res.data.expires_in * 1000

          	  wx.setStorageSync('access_token', accessToken)
          	  wx.setStorageSync('access_token_expired_at', accessTokenExpiredAt)
            wx.showModal({
                title: '成功',
                content: '已经成功刷新BearToken并保存了BearToken'
              })
            }
          })

        } catch (err) {
          wx.request({
            url: this.data.host+'weapp/authorizations',
            method: 'POST',
            data: {
          	  code: this.getCode,
          	  username: this.data.new_username,
          	  password: this.data.new_password
            },
            header:{'content-type':'application/json'},
            dataType: 'json',
            responseType: 'text',
            success : (res) =>{
          	  console.log(res.data)
          	  this.setData({
          		  BearToken: res.data.access_token,
          	  })
          	  //保存 token 和过期时间，然后返回
          	  const accessToken = res.data.access_token
          	  const accessTokenExpiredAt = new Date().getTime() + res.data.expires_in * 1000

          	  wx.setStorageSync('access_token', accessToken)
          	  wx.setStorageSync('access_token_expired_at', accessTokenExpiredAt)
              this.setData({
                storage_accessToken : wx.getStorageSync('access_token'),
                storage_expired_at : wx.getStorageSync('access_token_expired_at')
              })
              wx.showModal({
                  title: '成功',
                  content: '已经成功登录，并保存了BearToken'
                })
            },
            fail:(res) => {
              wx.showModal({
                  title: 'testfail',
                  content: 'testfail'
                })
            }
          })
        }
      }else if(accessToken && new Date().getTime() < expiredAt){
        wx.showModal({
            title: '提示',
            content: 'BearToken还未过期'
          })

      }else{
        wx.showModal({
            title: '提示',
            content: '请先登录获取第一次的BearToken'
          })
      }


  },
  passExpiredAt:function(){
    wx.setStorageSync('access_token_expired_at', 0)
    this.setData({
      storage_expired_at : 0
    })
  }

})

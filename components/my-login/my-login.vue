<template>
  <view class="login-container">
    <!-- 用户登录组件 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @click="getUserProfile">一键登录</button>
    <view class="tips-text">
      登录后尽享更多权益
    </view>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    methods: {
      //获取用户信息
      getUserProfile() {
        wx.getUserProfile({
          desc: '用于登录小程序', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            //将用户信息存储到vuex模块中 user.js
            this.$store.commit('m_user/updateUserInfo', res.userInfo);
            //调用getToken函数 来获取登录成功后的字符串
            this.getToken(res)
          }
        })
      },
      // 调用登录接口，换取永久的 token
       async getToken(info) {
         //  调用接口获取登录凭证code
         const [err, res] = await uni.login().catch(err => err)
         // 判断是否 uni.login() 调用失败
         if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！');
         //登录成功后 获取code成功 准备参数对象
         const query = {
           code: res.code,
           encryptedData: info.encryptedData,
           iv: info.iv,
           rawData: info.rawData,
           signature: info.signature
         }
         // console.log(query)
         //用query参数去换取登录成功后的token对象
      const {data:loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',query)
      // console.log(loginResult)
      /* 注意 在此处 只有被管理员配置为小程序的开发者后，才能获取请求登录token的接口 因此会调用失败*/
      if(loginResult.meta.status!==400) return uni.$showMsg('登录失败')
      uni.$showMsg('登录成功')
      //这里返回一个虚假的token
       this.$store.commit('m_user/updateToken','jwf666666');
       this.navigateBack()
       },
       //返回登录之前的界面
       navigateBack() {
         // redirectInfo 不为 null，并且导航方式为 switchTab
         if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
           // 调用小程序提供的 uni.switchTab() API 进行页面的导航
           uni.switchTab({
             // 要导航到的页面地址
             url: this.redirectInfo.from,
             // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
             complete: () => {
               this.$store.commit('m_user/updateRedirectInfo',null)
             }
           })
         }
       }
      
    },
    computed:{
      ...mapState('m_user',['redirectInfo'])
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F8F8F8;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .contact-filled {}

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>

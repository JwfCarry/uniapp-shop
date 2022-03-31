<template>
  <!-- 购物车结算页面-->
  <view class="my-settle-container">
    <!-- 全选-->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck"></radio><text>全选</text>
    </label>
    <!-- 合计-->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算-->
    <view class="btn-settle" @click="settleHandler">
      结算{{checkedCount}}
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        //倒计时秒数
        seconds: 3,
        //定时器id
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      //用来判断全选按钮是否选中 当购物车中的商品总数与已勾选总数相等时 全选按钮要选中 否则不选中
      isFullCheck() {
        return this.total === this.checkedCount
      }

    },
    methods: {
      //全选、反选所有勾选框函数
      changeAllState() {
        this.$store.commit('m_cart/changeAllGoodsState', !this.isFullCheck)
      },
      //结算按钮点击事件
      settleHandler() {
        //判断 是否选择了结算商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        //判断是否填写了收获地址
        if (!this.addstr) return uni.$showMsg('请选择收获地址')
        // if(!this.token) return uni.$showMsg('请先登录')
        if (!this.token) return this.gotoMyLogin()
      },
      //展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后跳转到登录界面',
          mask: true,
          duration: 1500
        })
      },
      //倒计时提示功能
      gotoMyLogin() {
        this.seconds = 3
        this.showTips(this.seconds);
        //创建定时器 每隔一秒执行一次
        this.timer = setInterval(() => {
          this.seconds-- //事件自-1
          if (this.seconds <= 0) {
            //如果此时定时器倒计时数字为<=0了 清除定时器
            clearInterval(this.timer);
            //跳转页面
            uni.switchTab({
              url: '../../pages/my/my',
              //把跳转信息返回给vuex中的重定向的 object 对象 { openType, from } 
              success: () => {
                this.$store.commit('m_user/updateRedirectInfo', {
          openType:'switchTab',
          from:'/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    /* 底部固定定位 */
    position: fixed;
    bottom: 0;
    left: 0;
    /* 设置宽高和背景色 */
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #C00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>

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
    <view class="btn-settle">
      结算{{checkedCount}}
    </view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed:{
       ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      //用来判断全选按钮是否选中 当购物车中的商品总数与已勾选总数相等时 全选按钮要选中 否则不选中
      isFullCheck(){
        return this.total===this.checkedCount
      }
      
    },
    methods:{
     changeAllState(){
       this.$store.commit('m_cart/changeAllGoodsState',!this.isFullCheck)
     }
    }
  }
</script>

<style lang="scss">
.my-settle-container{
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
    .radio{
     display: flex;
     align-items: center;
    }
    .amount-box{
      .amount{
        color: #C00000;
        font-weight: bold;
      }
    }
    .btn-settle{
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

<template>
<view>
  <view class="cart-container" v-if="cart.length!==0">
    <!-- 收获地址区域-->
    <my-address></my-address>
    <!-- 标题-->
    <view class="cart-title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 商品列表区域-->
    <uni-swipe-action>
      <block v-for="(item,i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="deleteGood(item)">
          <view class="goods-item">
            <!-- 商品左侧图片区域 -->
  
            <view class="goods-item-left">
              <radio :checked="item.goods_state" color="#C00000" @click="radioChange(item)"></radio>
              <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
            </view>
            <!-- 商品右侧信息区域 -->
            <view class="goods-item-right">
              <!-- 商品标题 -->
              <view class="goods-name">{{item.goods_name}}</view>
              <view class="goods-info-box">
                <!-- 商品价格 -->
                <view class="goods-price">￥{{item.goods_price}}</view>
                <!-- 商品数量 -->
                <uni-number-box :min="1" :value="item.goods_count" @change="(value)=>numChange(value,item)">
                </uni-number-box>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 底部结算区域-->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车区域-->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</view>
</template>

<script>
  import badge from '../../mixins/tabbar-badge.js';
  import {
    mapState
  } from 'vuex'
  export default {
    mixins: [badge],
    data() {

      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#F56C6C'
          }
        }]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      //点击勾选框函数
      radioChange(item) {
        this.$store.commit('m_cart/updataGoodsState', {
          goods_id: item.goods_id,
          goods_state: item.goods_state
        })
      },
      //点击删除按钮功能
      deleteGood(item) {
        this.$store.commit('m_cart/deleteCartGood', {
          goods_id: item.goods_id
        })
      },
      //商品数量改变事件
      numChange(value, item) {
        this.$store.commit('m_cart/changeGoodsCount', {
          goods_id: item.goods_id,
          goods_count: value
        })
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .goods-item {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  
    .empty-img {
      width: 90px;
      height: 90px;
    }
  
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>

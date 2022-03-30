<template>
  <view>
    <!-- 滑动区域-->
    <my-search @click="gotoSearch"></my-search>
    <view class="srcoll-view-container">
      <!-- 左侧-->
      <scroll-view class="left" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item,i) in cate" :key="i">
          <view :class="['left-scroll-view-item',i===active?'active':'']" @click="activeChange(i)">{{item.cat_name}}
          </view>
        </block>

      </scroll-view>
      <!-- 右侧-->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
    import badge from '../../mixins/tabbar-badge.js' 
  export default {
    mixins:[badge],
    data() {
      return {
        //窗口的可用高度
        wh: 0,
        //分类数据列表
        cate: [],
        //激活项
        active: 0,
        //二级分类
        cateLevel2: [],
        //滚动条顶部距离
        scrollTop: 0
      };
    },
    onLoad() { //页面生命周期函数
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      // console.log(sysInfo)
      this.wh = sysInfo.windowHeight
      this.getCateList()
    },
    methods: {
      //获取分类列表数据
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories');
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cate = res.message;
        this.cateLevel2 = res.message[0].children
      },
      //点击一级分类后
      activeChange(i) {
        this.active = i;
        this.cateLevel2 = this.cate[i].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      //点击三级分类图片 跳转到商品详情页
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '../../subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      //点击搜索事件
      gotoSearch(){
        uni.navigateTo({
          url:'../../subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .srcoll-view-container {
    display: flex;
    background-color: #FFFFFF;

    .left {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
</style>

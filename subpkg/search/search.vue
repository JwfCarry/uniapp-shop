<template>
  <view>

    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none" placeholder="请输入搜索内容" bgColor="#ffffff"
        focus="true">
      </uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史区域-->
    <view class="history-box" v-if="searchResults.length==0">
      <!-- 标题-->
      <view class="hitory-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表-->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //防抖处理数据
        timer: null,
        keywords: '',
        // 搜索结果列表
        searchResults: [],
        //历史记录列表
        historyList: []
      };
    },
    methods: {
      //输入框搜索事件
      input(e) {
        //防抖处理
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.keywords = e
          // console.log(this.keywords)
          this.getSearchList()
        }, 500)
        //调用获取搜索建议函数

      },
      //获取搜索建议数据
      async getSearchList() {
        //判断关键词是否为空
        if (this.keywords === '') {
          this.searchResults = []
          return
        }
        //发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.keywords
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message;
        this.saveHistoryList()
      },
      //点击搜索列表项跳转
      gotoDetail(goods_id) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      //保存搜索记录到历史记录中
      saveHistoryList() {
        // this.historyList.unshift(this.keywords)
        const setData = new Set(this.historyList)
        setData.delete(this.keywords)
        setData.add(this.keywords);
        this.historyList = Array.from(setData);
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('keywords', JSON.stringify(this.historyList))
      },
      //删除历史记录事件
      clean(){
        this.historyList=[]
        uni.clearStorageSync('keywords')
      },
      //点击搜索tag 跳转到相应的商品列表
      gotoGoodsList(keywords){
        uni.navigateTo({
          url:'../goods_list/goods_list?query='+keywords
        })
      }
    },
    computed: {
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('keywords') || '[]')
    }
  }
</script>

<style lang="scss">
  .search-box {
    background-color: #C00000;
    position: sticky;
    top: 0;
    z-index: 999;



  }

  .sugg-list {
    padding: 0 5px;
    background-color: #fff;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 5px;

    .hitory-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      uni-tag {
        margin-right: 5px;
      }
    }
  }
</style>

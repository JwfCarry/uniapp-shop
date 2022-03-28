<template>
  <view>
    <view class="goods-list">
      <view v-for="item in goodsList" :key="item.goods_id" @click="gotoDetail(item)">
        <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <!-- 商品标题 -->
            <view class="goods-name">{{item.goods_name}}</view>
            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="goods-price">￥{{item.goods_price}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        //商品列表数据
        goodsList: [],
        //商品总数量
        total: 0,
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
        // 节流阀
        isloading: false

      };
    },
    //生命周期函数
    onLoad(options) {
      //存储页面跳转带过来的商品列表参数
      this.queryObj.query = options.query || '';
      this.queryObj.cid = options.cid || ';'
      //调用获取商品列表数据的方法
      this.getGoodsList();
    },
    methods: {
      //获取商品列表数据
      async getGoodsList(cb) {
        this.isloading = true; //节流阀开启
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
         this.isloading = false //关闭节流阀
         cb&&cb()
        if (res.meta.status !== 200) return uni.$showMsg();
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total;
       
      },
gotoDetail(item){
  uni.navigateTo({
    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
  })
}
    },
    //上拉刷新事件
    onReachBottom() {
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！');//判断数据是否请求完了
      if (this.isloading) return //判断节流阀是否开启 开启中代表正在请求数据 禁止请求
      // 让页码值自增 +1
      this.queryObj.pagenum += 1
      // 重新获取列表数据
      this.getGoodsList()
    },
    //下拉刷新事件
    onPullDownRefresh() {
      //重置数据
       this.queryObj.pagenum = 1
        this.total = 0
        this.isloading = false
        this.goodsList = []
        //重新发起请求 只有在下拉刷新后 才需要停止刷新动作 
        this.getGoodsList(()=>{
          uni.stopPullDownRefresh()
        })
    },
    
  }
</script>

<style lang="scss">
  .goods-list {
    background-color: #FFFFFF;
  }

  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;

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

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>

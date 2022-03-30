//购物车vuex文件
export default {
  // 为当前模块开启命名空间
  namespaced: true,


  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),


  mutations: {
    //添加商品信息对象方法
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if (!findResult) {
        // 如果购物车中没有这件商品，则直接 push
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    //持久化存储购物车中的商品 解决项目重新编译后 购物车清空的问题
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    //更新购物车中的勾选状态
    updataGoodsState(state, value) {
      //根据点击勾选事件后传过来的被点击商品的id查找出cart中的此商品
      const findRasult = state.cart.find(x =>
        x.goods_id === value.goods_id
      );
      //找到后
      if (findRasult) {
        //勾选状态取反
        findRasult.goods_state = !findRasult.goods_state;
        //重新持久化储存到到本地
        this.commit('m_cart/saveToStorage')

      }
    },
    //删除购物车商品事件
    deleteCartGood(state, value) {
      //过滤出所有除了删除商品以外的商品
      state.cart = state.cart.filter(item => item.goods_id !== value.goods_id)
      //持久话保存到本地
      this.commit('m_cart/saveToStorage')
    },
    //更改商品数量
    changeGoodsCount(state,value){
     const findResult= state.cart.find(x=>
        x.goods_id===value.goods_id
      );
      if(findResult){
        findResult.goods_count=value.goods_count;
        this.commit('m_cart/saveToStorage')
      }
    },
    //全选与反选事件
    changeAllGoodsState(state,value){
      //value即传过来的是true还是false
      state.cart.forEach(item=>item.goods_state=value)
      this.commit('m_cart/saveToStorage')
    }
  },

  getters: {
    //购物车里面所有商品的总数量
    //1.用来显示底部tabbar购物车商品数量徽标值 
    //2.用来与已勾选商品的数量做比较 ，两者相等 则全选按钮要选中
    total(state) {
  return state.cart.reduce((total,item)=>total+=item.goods_count,0)
      
    },
    //已勾选商品的总数量
    checkedCount(state){
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
        // 再使用 reduce 方法，将已勾选的商品总数量进行累加
        // reduce() 的返回值就是已勾选的商品的总数量
   return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count,0)
    },
    //已勾选商品的总价格
    checkedGoodsAmount(state){
      //首先过滤出已勾选的商品 然后将每一件的商品的总价累加 最后保留两位小数
    return state.cart.filter(item=>item.goods_state).reduce((total,item)=>total+=item.goods_count*item.goods_price,0).toFixed(2)
    }
  },
}

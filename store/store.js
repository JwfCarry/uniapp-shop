// vuex文件
import Vue from 'vue';
import Vuex from 'vuex'
//导入购物车的 vuex 模块
import moduleCart from './cart.js'
//导入用户地址vuex模块
import moduleUser from './user.js'
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
      m_cart: moduleCart  ,//挂载cartvuex模块 路径重命名为m_cart
      m_user: moduleUser //挂载用户地址模块 重命名为m_user
  },
})
export default store;

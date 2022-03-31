//用户地址信息vuex文件
export default {
  namespaced: true,
  state: () => ({
    //收获地址对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录成功之后的 token 字符串
    token: uni.getStorageSync('token')||'',
    //用户信息
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的 object 对象 { openType, from } 
      redirectInfo: null
    
  }),
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address,
        //存储到本地
        this.commit('m_user/saveAddressToStorage')
    },
    //address持久存储到本地函数
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    //更新用户的基本信息
    updateUserInfo(state, value) {
      state.userinfo = value
      this.commit('m_user/saveUserInfoToStorage')
    },
    //用户信息持久化存储到本地函数
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    //更新token事件
    updateToken(state,value){
      state.token=value;
      this.commit('m_user/saveToStorage')
    },
    //本地化存储token函数
    saveToStorage(state){
      uni.setStorageSync('token',state.token)
    },
    // 更新重定向的信息对象
      updateRedirectInfo(state, info) {
        state.redirectInfo = info
      }
  },
  getters: {
    //地址文本
    addstr(state) {
      if (!state.address.cityName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  },
}

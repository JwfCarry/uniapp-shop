//用户地址信息vuex文件
export default {
  namespaced: true,
  state: () => ({
    //收获地址对象
   address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address,
      //存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    //将address持久存储到本地方法
   saveAddressToStorage(state){
     uni.setStorageSync('address',JSON.stringify(state.address))
   }
  },
  getters: {
    addstr(state){
      if(!state.address.cityName) return ''
      return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo
    },
  },
}

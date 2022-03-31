<template>
  <view class="my-container">
    <!-- 如果本地没有token显示登录界面 反之显示用户信息界面-->
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
import badge from '../../mixins/tabbar-badge.js'
import {mapState} from 'vuex'
  export default {
    mixins:[badge],
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user',['token'])
    }
  }
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>

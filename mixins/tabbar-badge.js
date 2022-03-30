
//设置购物车数字徽标混入代码
//因为 不是只有点击购物车时才会显示数字徽标，而是点击任意一个tabbar页面都要显示购物车的数字徽标 混入可减少代码量 提高运行效率
import { mapGetters } from "vuex"
export default {
  computed:{
    ...mapGetters('m_cart',['total'])
  },
  onShow() {
    //页面刚刚展示的时候设置数字徽标
    this.setBadge()
  },
  methods:{
    setBadge(){
      uni.setTabBarBadge({
        index:2,
        text:this.total+'' //text 的值必须是字符串，不能是数字
      })
    }
  },
  watch:{
    //监听total值的变化  用于解决点击商品数量增加（减少）按钮后 购物车tabbar徽标不变的情况
    total(){
      this.setBadge();
    }
  }
}
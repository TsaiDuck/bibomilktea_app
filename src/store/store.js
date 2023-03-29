import Vue from 'vue'
import Vuex from 'vuex'
import moduleUser from '@/store/user'
import moduleCart from '@/store/cart'

// 该指令必须在 store 创建之前执行
Vue.use(Vuex)

// 创建并导出 store
const store = new Vuex.Store({
  modules: {
    m_user: moduleUser,
    m_cart: moduleCart
  }
})

export default store

export default {
  namespaced: true,
  state() {
    return {
      cart: []
    }
  },
  mutations: {
    addCart(state, cartInfo) {
      state.cart.push(cartInfo)
    },
    addCount(state, index) {
      state.cart[index].count++
    },
    reduceCount(state, index) {
      if (state.cart[index].count == 1) {
        state.cart.splice(index, 1)
      } else {
        state.cart[index].count--
      }
    },
    clearCart(state) {
      state.cart = []
    },
    initCart(state) {
      state.cart = []
    }
  }
}

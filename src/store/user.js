export default {
  namespaced: true,
  state() {
    return {
      userInfo: {
        user_id: Number,
        user_name: '',
        user_phone: '',
        user_birthday: '',
        user_gender: '',
        user_address: '',
        user_head: '',
        user_root: 0,
        user_state: false
      }
    }
  },
  mutations: {
    updateUserInfo(state, user) {
      state.userInfo.user_id = user.user_id
      state.userInfo.user_name = user.user_name
      state.userInfo.user_phone = user.user_phone
      state.userInfo.user_birthday = user.user_birthday
      state.userInfo.user_gender = user.user_gender
      state.userInfo.user_address = user.user_address
      state.userInfo.user_state = true
      uni.setStorageSync('userInfo', state.userInfo)
    },
    setUserInfoByStorage(state) {
      const user = uni.getStorageSync('userInfo')
      if (user.user_state) {
        state.userInfo.user_id = user.user_id
        state.userInfo.user_name = user.user_name
        state.userInfo.user_phone = user.user_phone
        state.userInfo.user_birthday = user.user_birthday
        state.userInfo.user_gender = user.user_gender
        state.userInfo.user_address = user.user_address
        state.userInfo.user_state = true
      }
    },
    logout(state) {
      state.userInfo.user_id = 0
      state.userInfo.user_name = ''
      state.userInfo.user_phone = ''
      state.userInfo.user_birthday = ''
      state.userInfo.user_gender = ''
      state.userInfo.user_address = ''
      state.userInfo.user_state = false
      uni.setStorageSync('userInfo', '')
      uni.switchTab({ url: '/pages/user/index' })
    }
  },
  actions: {
    async postLogin(state, user) {
      const { data: res } = await uni.$http.post('/api/user/login', user)
      if (res.meta.status === 200) {
        console.log(res.data)
        uni.$showMsg('登录成功')
        this.commit('m_user/updateUserInfo', res.data.user)

        setTimeout(() => {
          uni.switchTab({ url: '/pages/user/index' })
        }, 1000)
      } else if (res.meta.status === 201) {
        uni.$showMsg('手机号或密码错误，请重新输入')
      } else {
        uni.$showMsg('服务器发生错误，请稍后重试')
      }
    },
    async postUpdateUserInfo(state, user) {
      const { data: res } = await uni.$http.post(
        '/api/user/update/userinfo',
        user
      )
      if (res.meta.status === 200) {
        console.log('update ok')
        this.commit('m_user/updateUserInfo', user)
      } else {
        console.log('update fail')
      }
    }
  },
  getters: {}
}

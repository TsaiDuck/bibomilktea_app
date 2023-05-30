import Vue from 'vue'
import App from './App'
import store from './store/store'

// 导入网路请求包
import { $http } from '@escook/request-miniprogram'

// 网络请求相关
uni.$http = $http
// 设置请求根路径
$http.baseUrl = 'https://www.tsaiduck.cn'
// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中'
  })
}
// 响应拦截器
$http.afterRequest = function (options) {
  uni.hideLoading()
}

// 弹框函数
uni.$showMsg = function (
  title = '数据请求失败！',
  duration = 1500,
  icon = 'none'
) {
  uni.showToast({
    title,
    duration,
    icon
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

uni.addInterceptor({
  returnValue(res) {
    if (!isPromise(res)) {
      return res
    }
    return new Promise((resolve, reject) => {
      res.then((res) => {
        if (res[0]) {
          reject(res[0])
        } else {
          resolve(res[1])
        }
      })
    })
  }
})

const app = new Vue({
  ...App,
  store
})
app.$mount()

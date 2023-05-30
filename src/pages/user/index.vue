<template>
  <div class="user">
    <!-- 背景图 -->
    <image :src="bgURL" mode="widthFix" class="user-bg" />
    <!-- 内容组件 -->
    <div class="user-content">
      <!-- 个人信息 -->
      <!-- 未登录 -->
      <div class="user-info" @click="getUserInfo" v-if="!userInfo.user_state">
        <!-- logo -->
        <image :src="bgURL" mode="widthFix" class="user-logo" />
        <!-- 登录/注册 -->
        <div class="login-register">登录/注册</div>
        <!-- 右侧按钮 -->
        <span class="user-btn"><van-icon name="arrow" /></span>
      </div>
      <!-- 已登录 -->
      <div class="user-info" v-else @click="setUserInfo">
        <image :src="bgURL" mode="widthFix" class="user-logo" />
        <!-- 个人信息 -->
        <div class="user-information">
          <span v-if="userInfo.user_name">{{ userInfo.user_name }}</span>
          <span>{{ userInfo.user_phone }}</span>
        </div>
        <!-- 右侧按钮 -->
        <span class="user-btn"><van-icon name="arrow" /></span>
      </div>
      <!-- 下方导航组件 -->
      <div class="user-nav">
        <!-- 订单 -->
        <div class="user-navbar" @click="gotoOrder">
          <van-icon name="notes-o" style="font-size: 48rpx; color: orange" />
          <text class="user-nav-text">我的订单</text>
          <van-icon name="arrow" />
        </div>
        <!-- 收货地址 -->
        <div class="user-navbar">
          <van-icon name="guide-o" style="font-size: 48rpx; color: orange" />
          <text class="user-nav-text">收货地址</text>
          <van-icon name="arrow" />
        </div>
        <!-- 更多 -->
        <div class="user-navbar">
          <van-icon name="question-o" style="font-size: 48rpx; color: orange" />
          <text class="user-nav-text">更多</text>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      bgURL: '../../static/images/00245-3553923336-.png'
    }
  },
  computed: {
    ...mapState('m_user', ['userInfo'])
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      uni.navigateTo({ url: '/subPackages/userLogin/index' })
    },
    setUserInfo() {
      uni.navigateTo({ url: '/subPackages/userInfo/index' })
    },
    gotoOrder() {
      uni.switchTab({ url: '/pages/order/index' })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {}
}
</script>

<style lang="less">
.user {
  position: relative;
  .user-bg {
    width: 100%;
  }
  .user-content {
    width: 90%;
    margin-left: 5%;
    position: absolute;
    top: 700rpx;
    .user-info {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: lightyellow;
      border-radius: 30rpx;
      height: 180rpx;

      .user-logo {
        width: 100rpx;
        border-radius: 50%;
      }
      .login-register {
        width: 400rpx;
        font-size: 40rpx;
      }
      .user-btn {
        display: block;
        font-size: 24rpx;
      }
      .user-information {
        width: 400rpx;
        height: 90rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .user-nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 28rpx;
    background-color: #fff;
    border-radius: 30rpx;
    .user-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120rpx;
      border-bottom: 1px solid #efefef;
      .user-nav-text {
        display: block;
        width: 500rpx;
        margin-left: 20rpx;
      }
    }
  }
}
</style>

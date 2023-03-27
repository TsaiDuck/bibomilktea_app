<template>
  <div class="userInfo">
    <!-- 返回 -->
    <div class="back">
      <div class="back-content" @click="back">
        <van-icon class="back-icon" name="arrow-left" />
        <text class="back-text">碧波奶茶</text>
      </div>
    </div>
    <!-- 内容栏 -->
    <div class="userInfo-content">
      <!-- 头像 -->
      <div class="content-head">
        <image
          src="../../static/images/00245-3553923336-.png"
          class="content-head-img"
        />
      </div>
      <!-- 资料 -->
      <div class="content-tips">注册信息</div>
      <!-- 资料内容 -->
      <div class="content-info">
        <div class="info-item">
          <text class="info-title">手机</text>
          <div class="info-content">
            <input placeholder="请输入手机号" v-model="userInfo.user_phone" />
          </div>
          <div class="info-operation"></div>
        </div>
        <div class="info-item">
          <text class="info-title">密码</text>
          <div class="info-content">
            <input
              type="password"
              placeholder="请输入密码"
              v-model="userInfo.user_pwd"
            />
          </div>
          <div class="info-operation"></div>
        </div>
      </div>
      <!-- 选项 -->
      <div class="operate-select">
        <!-- 保存按钮 -->
        <button class="btn-save" @click="login">登录</button>
        <button
          class="btn-save"
          @click="gotoRegister"
          style="margin-top: 10rpx"
        >
          没有账号？立即注册
        </button>
        <!-- 退出登录 -->
        <text class="text-quit" @click="back">退出</text>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      userInfo: {
        user_phone: Number,
        user_pwd: ''
      }
    }
  },
  computed: {},
  methods: {
    ...mapMutations('m_user', ['updateUserInfo']),
    ...mapActions('m_user', ['postLogin']),
    back() {
      uni.navigateBack({ delta: 1 })
    },
    login() {
      this.postLogin(this.userInfo)
    },
    gotoRegister() {
      uni.navigateTo({ url: '/subPackages/userRegister/index' })
    }
  }
}
</script>

<style lang="less">
.userInfo {
  .back {
    width: 100%;
    height: 160rpx;
    background-color: #fff;
    position: relative;
    .back-content {
      position: absolute;
      bottom: 24rpx;
      .back-icon {
        margin-left: 16rpx;
        font-size: 36rpx;
      }
      .back-text {
        margin-left: 16rpx;
        font-size: 36rpx;
      }
    }
  }
  .userInfo-content {
    width: 90%;
    margin: 24rpx 0 0 5%;
    .content-head {
      width: 100%;
      height: 270rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border-radius: 24rpx;
      box-shadow: 0 0 8rpx #dedede;
      .content-head-img {
        width: 140rpx;
        height: 140rpx;
        padding: 8rpx;
        border: 1px solid #f7b52c;
        border-radius: 50%;
      }
    }
    .content-tips {
      margin-top: 36rpx;
      font-size: 28rpx;
      color: gray;
    }
    .content-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      border-radius: 24rpx;
      box-shadow: 0 0 6rpx #dedede;
      margin-top: 20rpx;
      font-size: 30rpx;

      .info-item {
        width: 90%;
        height: 120rpx;
        border-bottom: 1px solid #efefef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-title {
          width: 140rpx;
        }
        .info-content {
          width: 300rpx;
        }
        .info-operation {
          width: 50rpx;
        }
      }
    }
    .operate-select {
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn-save {
        width: 100%;
        line-height: 90rpx;
        height: 90rpx;
        background-color: #f7b52c;
        color: #fff;
        border-radius: 18rpx;
        margin-top: 80rpx;
      }
      .text-quit {
        display: block;
        margin-top: 40rpx;
        color: gray;
      }
    }
  }
}
</style>

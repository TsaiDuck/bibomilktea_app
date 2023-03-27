<template>
  <div class="home">
    <!-- 轮播图 -->
    <div>
      <swiper
        :indicator-dots="true"
        :autoplay="true"
        :circular="true"
        class="swiper"
      >
        <swiper-item v-for="(item, i) in imgPath" :key="i">
          <image :src="item" mode="widthFix" class="swiper-img" />
        </swiper-item>
      </swiper>
    </div>
    <!-- 内容区 -->
    <div class="home-content">
      <!-- 个人信息 -->
      <div class="userInfo">
        <!-- 未登录 -->
        <div class="notLogin">
          <!-- 左侧文字 -->
          <div class="left-text">
            <div class="left-vip">碧波会员</div>
            <text class="left-toVip">成为会员可累计积分</text>
          </div>
          <!-- 右侧按钮 -->
          <button class="btn-login">登录</button>
        </div>
        <!-- 已登录 -->
        <!-- <div class="logged-in">

        </div> -->
      </div>
      <!-- 点餐/外卖 -->
      <div class="choose-bread">
        <!-- 点餐 -->
        <div class="choose-bread-order">
          <!-- logo -->
          <image
            src="../../static/images/milktea.png"
            mode="scaleToFill"
            class="order-img"
          />
          <div class="order-text">
            <text class="order-text-title">点餐</text>
            <br />
            <text class="order-text-tips">在线点单到店取</text>
          </div>
        </div>
        <!-- 外卖 -->
        <div class="choose-bread-order" style="bottom-right: 0">
          <!-- logo -->
          <image
            src="../../static/images/car.png"
            mode="scaleToFill"
            class="order-img"
          />
          <div class="order-text">
            <text class="order-text-title">外卖</text>
            <br />
            <text class="order-text-tips">外卖下单送到家</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  components: {},
  data() {
    return {
      imgPath: [
        '../../static/images/milktea1.jpeg',
        '../../static/images/milktea2.jpeg',
        '../../static/images/milktea3.jpeg',
        '../../static/images/milktea4.jpeg',
        '../../static/images/milktea5.jpeg'
      ]
    }
  },
  computed: {},
  methods: {
    ...mapMutations('m_user', ['setUserInfoByStorage'])
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.setUserInfoByStorage()
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {}
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
}
</script>

<style lang="less">
.home {
  .swiper {
    height: 750rpx;
    .swiper-img {
      height: 100%;
      width: 100%;
    }
  }
  .home-content {
    margin: 20rpx;
    &::after {
      content: '';
      display: block;
      clear: both;
    }
    .userInfo {
      width: 100%;
      .notLogin {
        display: flex;
        justify-content: space-between;
        .left-text {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .left-vip {
            font-size: 40rpx;
            font-weight: bold;
            color: #f7b52c;
          }
          .left-toVip {
            color: gray;
            font-size: 28rpx;
          }
        }
        .btn-login {
          width: 200rpx;
          height: 80rpx;
          color: #ffffff;
          background-color: #f7b52c;
          margin: 0;
          line-height: 80rpx;
          border-radius: 18rpx;
        }
      }
    }
    .choose-bread {
      background-color: #fff;
      border-radius: 18rpx;
      width: 100%;
      height: 350rpx;
      margin-top: 30rpx;
      padding-top: 1px;
      display: flex;

      .choose-bread-order {
        width: 50%;
        height: 200rpx;
        margin-top: 50rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid lightgray;
        position: relative;
        .order-img {
          width: 100rpx;
          height: 130rpx;
          position: absolute;
          top: -20rpx;
        }
        .order-text {
          margin-top: 180rpx;
          text-align: center;

          .order-text-title {
            font-size: 36rpx;
            color: #000000;
            font-weight: bold;
          }
          .order-text-tips {
            font-size: 24rpx;
            color: gray;
          }
        }
      }
    }
  }
}
</style>

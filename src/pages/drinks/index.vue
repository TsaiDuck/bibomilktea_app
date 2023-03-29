<template>
  <div class="drinks">
    <!-- 顶部导航 -->
    <div class="nav">
      <!-- 状态栏遮罩层 -->
      <div class="shadow"></div>
      <!-- 首页logo -->
      <image src="../../static/icon/icon-home.png" class="nav-logo" />
      <!-- 搜索框 -->
      <button class="nav-search"><van-icon name="search" />&emsp;搜索</button>
    </div>
    <!-- 内容区 -->
    <div class="drinks-content">
      <!-- 左侧滚动条 -->
      <scroll-view
        scroll-y
        class="scroll-left"
        :style="{ height: windowHeight + 'px' }"
      >
        <div
          v-for="(item, i) in goodClassList"
          :key="i"
          :class="[
            'scroll-left-item',
            activeSpan == 'active' + i ? 'scroll-left-item-active' : ''
          ]"
          @click="scrollTo(i)"
        >
          找{{ item }}
        </div>
      </scroll-view>
      <!-- 右侧滚动条 -->
      <scroll-view
        scroll-y
        class="scroll-right"
        :style="{ height: windowHeight + 'px' }"
        @scroll="scrollRight"
        :scroll-into-view="scrollNumber"
        scroll-with-animation
      >
        <div class="good-list" v-for="(item, i) in goodClassList" :key="i">
          <span class="good-list-span" :id="'goodList' + i">找{{ item }}</span>
          <uniGood
            v-for="(item2, i2) in goodList.filter((x) => x.good_class === item)"
            :key="item2.good_id"
            :good="item2"
            :setWidth="410"
            :windowHeight="windowHeight"
          ></uniGood>
        </div>
        <div style="height: 240rpx"></div>
      </scroll-view>
    </div>
    <!-- 购物车 -->
    <div class="cart" v-if="cart.length != 0">
      <div class="cart-img-box">
        <image
          src="../../static/icon/icon-cart-active.png"
          class="cart-img"
          @click="openShowCart"
        ></image
        ><span class="cart-img-tips">{{
          cart.reduce((lastVal, currentVal) => lastVal + currentVal.count, 0)
        }}</span>
      </div>
      <div class="cart-price">
        <span style="font-size: 24rpx">￥</span>
        {{
          cart
            .reduce(
              (lastVal, currentVal) =>
                lastVal +
                currentVal.good_price * currentVal.count +
                currentVal.etc.reduce((a, b) => a + b[1], 0),
              0
            )
            .toFixed(2)
        }}
      </div>
      <div class="cart-btn">去结算</div>
    </div>
    <!-- 购物车弹窗信息 -->
    <van-popup
      :show="showCart"
      round
      position="bottom"
      custom-style="maxheight: 50%"
      @close="closeShowCart"
      z-index="98"
    >
      <div class="cartInfo">
        <!-- 购物车弹窗标题 -->
        <div class="cartInfo-title">
          <span style="margin-left: 30rpx">已选商品</span>
          <span style="color: gray; margin-right: 30rpx" @click="clearCart"
            ><van-icon name="delete-o" />&nbsp;删除</span
          >
        </div>
        <!-- 购物车弹窗内容 -->
        <div class="cartInfo-content">
          <scroll-view
            scroll-y
            :style="{ 'max-height': (windowHeight * 0.35).toFixed(0) + 'px' }"
          >
            <div
              class="cartInfo-content-item"
              v-for="(item, i) in cart"
              :key="item.good_id"
            >
              <!-- 图片 -->
              <image :src="item.good_img" class="cartInfo-content-item-img" />
              <!-- 信息 -->
              <div class="cartInfo-content-item-info">
                <!-- 商品名 -->
                <span style="font-size: 32rpx">{{ item.good_name }}</span>
                <!-- 规格信息 -->
                <span class="choice-info"
                  >已选：{{ item.size }}/{{ item.ice }}/{{ item.sugar }}
                  <span v-for="(item2, i2) in item.etc" :key="i2"
                    >/{{ item2[0] }}</span
                  >
                </span>
                <!-- 价格 -->
                <span class="choice-price"
                  ><span style="font-size: 24rpx">￥</span
                  >{{
                    (
                      Number(item.good_price) * Number(item.count) +
                      item.etc.reduce((a, b) => a + b[1], 0)
                    ).toFixed(2)
                  }}</span
                >
              </div>
              <!-- 按钮 -->
              <div class="cartInfo-content-item-btn">
                <span
                  class="cartInfo-content-item-btn-left"
                  @click="reduceCount(i)"
                  >-</span
                >
                <span>{{ item.count }}</span>
                <span
                  class="cartInfo-content-item-btn-right"
                  @click="addCount(i)"
                  >+</span
                >
              </div>
            </div>
          </scroll-view>
        </div>
        <!-- 底部留白 -->
        <div class="cartInfo-space"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import uniGood from '@/components/goodList/index'
import { mapState, mapMutations } from 'vuex'
export default {
  components: { uniGood },
  data() {
    return {
      goodList: [],
      windowHeight: 0,
      goodClassList: [],
      scrollNumber: 'goodList0',
      scrollDistance: [0],
      activeSpan: 'active0',
      showCart: false
    }
  },
  computed: {
    ...mapState('m_cart', ['cart'])
  },
  methods: {
    ...mapMutations('m_cart', ['addCount', 'reduceCount', 'clearCart']),
    async getGoodList() {
      const { data: res } = await uni.$http.get('/api/goodlist')
      if (res.meta.status !== 200) return uni.$showMsg()
      this.goodList = res.data
      this.goodClassList = [...new Set(this.goodList.map((x) => x.good_class))]
      this.calculateScroll()
    },
    scrollRight(e) {
      for (let i = 0; i < this.scrollDistance.length; i++) {
        if (
          e.detail.scrollTop >= this.scrollDistance[i] &&
          e.detail.scrollTop < this.scrollDistance[i + 1]
        ) {
          this.activeSpan = 'active' + i
        }
      }
    },
    scrollTo(index) {
      this.scrollNumber = 'goodList' + index
      this.activeSpan = 'active' + index
    },
    calculateScroll() {
      let sum = 0
      this.goodClassList.forEach((x) => {
        sum += this.goodList.filter((y) => y.good_class === x).length * 100 + 40
        this.scrollDistance.push(sum)
      })
    },
    openShowCart() {
      this.showCart = !this.showCart
    },
    closeShowCart() {
      this.showCart = false
    }
  },
  watch: {
    cart() {
      if (this.cart.length == 0) {
        this.showCart = false
      }
    }
  },

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getGoodList()
    this.windowHeight = uni.getSystemInfoSync().windowHeight - 90
  }
}
</script>

<style lang="less">
.drinks {
  position: relative;
  .nav {
    position: sticky;
    z-index: 10;
    top: 0;
    width: 100%;
    height: 90px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    box-shadow: 0 1px 1px #eeeeee;
    .shadow {
      height: 80rpx;
      background-color: #fff;
    }
    .nav-logo {
      width: 30rpx;
      height: 30rpx;
      padding: 10rpx;
      border-radius: 50%;
      border: 1px solid gray;
      position: absolute;
      left: 16rpx;
      top: 75%;
      transform: translateY(-50%);
    }
    .nav-search {
      width: 300rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 30rpx;
      font-size: 28rpx;
      color: gray;
      background-color: #eeeeee;
    }
  }
  .drinks-content {
    display: flex;
    .scroll-left {
      width: 160rpx;
      .scroll-left-item {
        width: 100%;
        text-align: center;
        height: 120rpx;
        line-height: 120rpx;
        font-size: 24rpx;
      }
      .scroll-left-item-active {
        background-color: #fff;
        color: #f7b52c;
      }
    }
    .scroll-right {
      background: #fff;
      .good-list {
        .good-list-span {
          display: block;
          width: 140rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-size: 24rpx;
          text-align: center;
          background-color: #ffffaa;
          color: #f7b52c;
          margin: 20rpx 0;
          margin-left: 10rpx;
          border-radius: 12rpx;
        }
      }
    }
  }
  .cart {
    position: absolute;
    bottom: 28rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 120rpx;
    border-radius: 2em;
    box-shadow: -1px 1px 2px #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    z-index: 99;
    .cart-img-box {
      position: relative;
      .cart-img {
        width: 80rpx;
        height: 80rpx;
        margin-left: 50rpx;
      }
      .cart-img-tips {
        display: block;
        width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
        border-radius: 50%;
        text-align: center;
        background-color: red;
        color: #fff;
        position: absolute;
        right: -14rpx;
        top: 0;
      }
    }
    .cart-price {
      font-size: 40rpx;
      font-weight: 500;
      width: 260rpx;
    }
    .cart-btn {
      width: 240rpx;
      height: 120rpx;
      line-height: 120rpx;
      text-align: center;
      background: #f7b52c;
      color: #fff;
      font-size: 32rpx;
      font-weight: 450;
      border-radius: 0 2em 2em 0;
    }
  }
  .cartInfo {
    .cartInfo-title {
      font-size: 32rpx;
      width: 100%;
      height: 100rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid gray;
    }
    .cartInfo-content {
      .cartInfo-content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10rpx 0;
        height: 180rpx;
        .cartInfo-content-item-img {
          width: 160rpx;
          height: 160rpx;
          margin-left: 30rpx;
        }
        .cartInfo-content-item-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 320rpx;
          .choice-info {
            height: 80rpx;
            font-size: 28rpx;
            color: gray;
            overflow: hidden visible;
          }
          .choice-price {
            color: red;
          }
        }
        .cartInfo-content-item-btn {
          width: 140rpx;
          margin-right: 30rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .cartInfo-content-item-btn-left {
            box-sizing: border-box;
            display: block;
            border-radius: 50%;
            width: 40rpx;
            height: 40rpx;
            text-align: center;
            line-height: 32rpx;
            font-size: 48rpx;
            background-color: #fff;
            color: #f7b52c;
            border: 1px solid #f7b52c;
          }
          .cartInfo-content-item-btn-right {
            box-sizing: border-box;
            display: block;
            border-radius: 50%;
            width: 40rpx;
            height: 40rpx;
            text-align: center;
            line-height: 30rpx;
            font-size: 48rpx;
            background-color: #f7b52c;
            color: #fff;
            border: 1px solid #f7b52c;
          }
        }
      }
    }
    .cartInfo-space {
      height: 100rpx;
    }
  }
}
</style>

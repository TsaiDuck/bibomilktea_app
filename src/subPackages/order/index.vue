<template>
  <div class="order" :style="{ height: windowHeight + 'px' }">
    <!-- 顶部navigator组件 -->
    <div class="navigator">
      <div class="navigator-content-box" @click="backToOldPage">
        <van-icon name="arrow-left" style="margin-right: 20rpx" />
        <span>提交订单</span>
      </div>
    </div>
    <!-- 订单内容 -->
    <div class="order-content">
      <!-- 店铺信息 -->
      <div class="shopInfo">
        <!-- 店铺名 -->
        <div class="shop-name">
          <span>河北工业大学廊坊分校8号楼店</span>
          <van-icon name="arrow" style="margin-left: 10rpx" />
        </div>
        <!-- 点餐形式 -->
        <div class="shop-style">
          <span
            :class="takeShopByYourself ? 'active' : ''"
            @click="changeTakeShopStyle(true)"
            >自取</span
          >
          <span :class="!takeShopByYourself ? 'active' : ''" @click="tips"
            >外卖</span
          >
        </div>
      </div>
      <!-- 取餐信息 -->
      <div class="takeShopInfo">
        <!-- 取餐时间 -->
        <div class="takeShop-item">
          <span>取餐时间</span>
          <span>立即取餐</span>
        </div>
        <!-- 排队进度 -->
        <div class="takeShop-item" style="border: 0">
          <span>排队进度</span>
          <span
            >前面还有<span style="color: orange"
              >{{ howManyOrderBefore.sumOrder }}单/{{
                howManyOrderBefore.sumCount
              }}杯</span
            >制作中</span
          >
        </div>
      </div>
      <!-- 订单详情信息 -->
      <div class="orderInfo">
        <!-- 商品信息 -->
        <div class="goodsInfo">
          <div class="goodsInfo-item" v-for="(item, i) in cart" :key="i">
            <!-- 商品图片 -->
            <image :src="item.good_img" class="goodsInfo-item-img" />
            <!-- 商品内容 -->
            <div class="goodsInfo-item-info">
              <!-- 商品名称价格 -->
              <div class="goodInfo-item-info-title">
                <span>{{ item.good_name }}</span>
                <span
                  >￥{{
                    (
                      (Number(item.good_price) +
                        item.etc.reduce((a, b) => a + b[1], 0)) *
                      Number(item.count)
                    ).toFixed(2)
                  }}</span
                >
              </div>
              <!-- 商品规格信息 -->
              <div class="goodInfo-item-info-size">
                <span class="goodInfo-item-info-size-info"
                  >{{ item.size }}/{{ item.ice }}/{{ item.sugar }}
                  <span v-for="(item2, i2) in item.etc" :key="i2"
                    >/{{ item2[0] }}</span
                  ></span
                >
                <span>x{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 优惠劵积分信息 -->
        <!-- <div class="goodsDiscounts"> -->
        <!-- 优惠劵 -->
        <!-- <div class="goodsDiscounts-item">
            <span class="goodsDiscounts-item-title">优惠劵</span>
            <span
              >无可用优惠劵<van-icon name="arrow" style="margin-left: 16rpx"
            /></span>
          </div> -->
        <!-- 积分 -->
        <!-- <div class="goodsDiscounts-item">
            <span class="goodsDiscounts-item-title">积分</span>
            <span
              >无可用积分<van-icon name="arrow" style="margin-left: 16rpx"
            /></span>
          </div>
        </div> -->
        <!-- 小计 -->
        <div class="goodsSum">
          <!-- 方便布局用 -->
          <span></span>
          <!-- 内容 -->
          <div class="goodSum-info">
            <span
              >共{{ cart.reduce((a, b) => a + b.count, 0) }}件商品，小计￥<span
                style="font-size: 42rpx"
                >{{
                  cart
                    .reduce(
                      (lastVal, currentVal) =>
                        lastVal +
                        currentVal.good_price * currentVal.count +
                        currentVal.etc.reduce((a, b) => a + b[1], 0) *
                          currentVal.count,
                      0
                    )
                    .toFixed(2)
                }}</span
              ></span
            >
          </div>
        </div>
      </div>
      <!-- 订单备注 -->
      <div class="orderRemark">
        <div class="orderRemark-box">
          <span>备注</span>
          <input
            placeholder="请输入"
            placeholder-style="text-align:right"
            style="text-align: right"
            v-model="order_info"
          />
        </div>
      </div>
      <!-- 支付弹框 -->
      <van-dialog
        use-slot
        title="支付"
        :show="showPay"
        show-cancel-button
        @close="closeDialog"
        @cancel="gotoOrder(false)"
        @confirm="gotoOrder(true)"
      >
        <div class="payDialog-info">
          <p>您无需支付任何费用</p>
          <p>点击确认则认为您已支付</p>
          <p>点击取消则是未支付</p>
        </div>
      </van-dialog>
    </div>
    <!-- 待支付 -->
    <div class="readyToPay">
      <div class="readyToPay-box">
        <!-- 待支付金额 -->
        <span class="readyToPay-price"
          >待支付，￥<span style="font-size: 42rpx">{{
            cart
              .reduce(
                (lastVal, currentVal) =>
                  lastVal +
                  currentVal.good_price * currentVal.count +
                  currentVal.etc.reduce((a, b) => a + b[1], 0) *
                    currentVal.count,
                0
              )
              .toFixed(2)
          }}</span></span
        >
        <!-- 支付按钮 -->
        <div class="readyToPay-btn" @click="showDialog">提交订单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  components: {},
  data() {
    return {
      takeShopByYourself: true,
      windowHeight: uni.getSystemInfoSync().windowHeight,
      order_info: '',
      showPay: false,
      howManyOrderBefore: {}
    }
  },
  computed: {
    ...mapState('m_cart', ['cart']),
    ...mapState('m_user', ['userInfo'])
  },
  methods: {
    ...mapMutations('m_cart', ['initCart']),
    changeTakeShopStyle(flag) {
      if (this.takeShopByYourself == flag) return
      this.takeShopByYourself = !this.takeShopByYourself
    },
    backToOldPage() {
      uni.navigateBack({ delta: 1 })
    },
    async addOrder(isPay) {
      const order = {
        order_user_id: this.userInfo.user_id,
        order_price: this.cart
          .reduce(
            (lastVal, currentVal) =>
              lastVal +
              currentVal.good_price * currentVal.count +
              currentVal.etc.reduce((a, b) => a + b[1], 0) * currentVal.count,
            0
          )
          .toFixed(2),
        order_info: this.order_info,
        cart: this.cart,
        order_state: isPay ? '已下单' : '待支付',
        order_take_way: this.takeShopByYourself ? '自取' : '外卖',
        order_count: this.cart.reduce((a, b) => a + b.count, 0)
      }
      const { data: res } = await uni.$http.post(
        '/api/addorder',
        JSON.stringify(order)
      )
      this.initCart()
      if (res.meta.status != 200) {
        uni.$showMsg()
        console.log(res)
      }
    },
    showDialog() {
      this.showPay = true
    },
    closeDialog() {
      this.showPay = false
    },
    gotoOrder(isPay) {
      this.closeDialog()
      this.addOrder(isPay)
      setTimeout(() => {
        uni.switchTab({ url: '/pages/order/index' })
      }, 1000)
    },
    async beforeOrder() {
      const { data: res } = await uni.$http.get('/api/now/order')
      this.howManyOrderBefore = res.data
    },
    tips() {
      uni.$showMsg('本店暂不提供外卖服务~')
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.beforeOrder()
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
.order {
  font-weight: 500;
  position: relative;
  .navigator {
    width: 100%;
    height: 180rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    .navigator-content-box {
      position: absolute;
      left: 20rpx;
      bottom: 20rpx;
      font-size: 36rpx;
      font-weight: 500;
    }
  }
  .order-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .shopInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 95%;
      height: 120rpx;
      margin-top: 40rpx;
      background-color: #fff;
      border-radius: 24rpx;
      .shop-name {
        font-size: 30rpx;
      }
      .shop-style {
        width: 160rpx;
        height: 60rpx;
        font-size: 24rpx;
        background: #eee;
        color: gray;
        border: 1px solid lightgray;
        border-radius: 36rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .active {
          display: block;
          padding: 11rpx 17rpx;
          background-color: #f7b52c;
          color: #fff;
          border-radius: 36rpx;
        }
      }
    }
    .takeShopInfo {
      width: 95%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-top: 40rpx;
      background-color: #fff;
      border-radius: 24rpx;
      .takeShop-item {
        width: 90%;
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;
        border-bottom: 1px solid lightgray;
      }
    }
    .orderInfo {
      width: 95%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 40rpx;
      background-color: #fff;
      border-radius: 24rpx;
      .goodsInfo {
        width: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .goodsInfo-item {
          height: 160rpx;
          display: flex;
          align-items: center;
          .goodsInfo-item-img {
            width: 130rpx;
            height: 130rpx;
          }
          .goodsInfo-item-info {
            width: 490rpx;
            height: 120rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin-left: 30rpx;
            .goodInfo-item-info-title {
              display: flex;
              justify-content: space-between;
              font-size: 30rpx;
              width: 100%;
            }
            .goodInfo-item-info-size {
              display: flex;
              height: 40rpx;
              justify-content: space-between;
              font-size: 24rpx;
              color: gray;
              width: 100%;
              .goodInfo-item-info-size-info {
                width: 400rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .goodsDiscounts {
        width: 95%;
        margin-top: 30rpx;
        .goodsDiscounts-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 30rpx;
          height: 70rpx;
          .goodsDiscounts-item-title {
            margin-left: 12rpx;
          }
        }
      }
      .goodsSum {
        width: 95%;
        height: 60rpx;
        margin: 30rpx 0;
        display: flex;
        justify-content: space-between;
      }
    }
    .orderRemark {
      width: 95%;
      height: 130rpx;
      margin-top: 40rpx;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 24rpx;
      margin-bottom: 70rpx;
      font-size: 30rpx;
      .orderRemark-box {
        width: 90%;
        height: 50rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .payDialog-info {
      width: 100%;
      height: 300rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
  }
  .readyToPay {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 140rpx;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .readyToPay-box {
      width: 88%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      align-items: center;
      .readyToPay-btn {
        width: 260rpx;
        height: 86rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 36rpx;
        border-radius: 12rpx;
        background-color: #f7b52c;
        color: #fff;
      }
    }
  }
}
</style>

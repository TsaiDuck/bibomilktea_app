<template>
  <div class="order">
    <!-- 顶部navigator -->
    <div class="navigatorBar">
      <!-- 留白 -->
      <div class="space"></div>
      <!-- 碧波奶茶 -->
      <div class="bibo">碧波奶茶</div>
      <!-- 订单查看 -->
      <div class="orderCheck">
        <div
          :class="['order-select', active == 'current' ? 'active' : '']"
          @click="changeActive('current')"
        >
          当前订单
        </div>
        <div
          :class="['order-select', active == 'history' ? 'active' : '']"
          @click="changeActive('history')"
        >
          历史订单
        </div>
      </div>
    </div>
    <!-- 订单内容 -->
    <div class="order-content">
      <!-- 当前订单 -->
      <div class="order-current" v-if="active == 'current'">
        <!-- 没有订单时 -->
        <div class="no-order" v-if="current_state">
          <image src="../../static/images/orderBg.png" class="no-order-img" />
          <div class="no-order-text">当前没有进行中的订单，来一杯吧</div>
          <button class="no-order-btn" @click="gotoDrink">去点单</button>
        </div>
        <!-- 当前有订单时 -->
        <div
          class="orders"
          v-else
          v-for="(item, i) in currentOrderList"
          :key="item.order_id"
        >
          <!-- 订单状态栏 -->
          <div class="orders-item">
            <div class="state">
              <!-- 已下单 -->
              <div class="state-item">
                <image
                  src="../../static/icon/icon-order-state.png"
                  class="state-order-img"
                />
                <span>已下单</span>
              </div>
              <span class="state-ellipsis">·········</span>
              <!-- 制作中 -->
              <div class="state-item">
                <image
                  src="../../static/icon/icon-order-state-make.png"
                  class="state-order-img"
                />
                <span>制作中</span>
              </div>
              <span class="state-ellipsis">·········</span>
              <!-- 待取餐 -->
              <div class="state-item">
                <image
                  src="../../static/icon/icon-order-state-take.png"
                  class="state-order-img"
                />
                <span>待取餐</span>
              </div>
            </div>
          </div>
          <!-- 未支付时显示 -->
          <div class="orders-item" v-if="item.order_state == '待支付'">
            <div class="tips">
              <!-- 按钮 -->
              <div class="btn">
                <button class="btn-cancel" @click="confirmCancel">
                  取消订单
                </button>
                <button class="btn-pay" @click="confirmPay">去支付</button>
              </div>
              <!-- 提示 -->
              <span style="font-size: 28rpx"
                >请在15分钟内支付订单<br />否则订单会自行取消<span
                  style="color: orange"
                ></span
              ></span>
              <!-- 支付弹框 -->
              <van-dialog
                use-slot
                title="支付"
                :show="showPay"
                show-cancel-button
                @close="closeDialog"
                @cancel="gotoPay(false, item.order_id)"
                @confirm="gotoPay(true, item.order_id)"
              >
                <div class="payDialog-info">
                  <p>您无需支付任何费用</p>
                  <p>点击确认则认为您已支付</p>
                  <p>点击取消则是未支付</p>
                </div>
              </van-dialog>
              <!-- 取消订单弹框 -->
              <van-dialog
                use-slot
                title="支付"
                :show="showCancel"
                show-cancel-button
                @close="closeDialog"
                @cancel="gotoOrder(false, item.order_id)"
                @confirm="gotoOrder(true, item.order_id)"
              >
                <div class="payDialog-info">
                  <p>确认取消订单吗?</p>
                </div>
              </van-dialog>
            </div>
          </div>
          <!-- 前面还有··· -->
          <div class="orders-item">
            <div class="making">
              <div>
                前面还有<span style="color: orange"
                  >{{ item.howManyOrderBefore.sumOrder }}单/{{
                    item.howManyOrderBefore.sumCount
                  }}杯</span
                >制作中
              </div>
              <div>
                您的取餐号为：<span style="color: #f7b52c">{{
                  item.order_dayId
                }}</span>
              </div>
            </div>
          </div>
          <!-- 订单信息 -->
          <div class="orders-item" style="border-bottom: 0">
            <componentOrder style="width: 100%" :order="item"></componentOrder>
          </div>
        </div>
      </div>
      <!-- 历史订单 -->
      <div class="order-history" v-else>
        <!-- 没有订单时 -->
        <div class="no-order" v-if="history_state">
          <image src="../../static/images/orderBg.png" class="no-order-img" />
          <div class="no-order-text">您还没有点过餐呢，来一杯吧</div>
          <button class="no-order-btn" @click="gotoDrink">去点单</button>
        </div>
        <!-- 有订单时 -->
        <div
          v-else
          class="order-item"
          v-for="(item, i) in historyOrderList"
          :key="item.order_id"
        >
          <componentOrder style="width: 90%" :order="item"></componentOrder>
        </div>
      </div>
    </div>
    <!-- 底部留白 -->
    <div class="space" style="height: 50rpx"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import componentOrder from '@/components/orderBrief/index'
export default {
  components: { componentOrder },
  data() {
    return {
      active: 'current',
      current_state: true,
      history_state: true,
      currentOrderList: [],
      historyOrderList: [],
      orderCartList: [],
      showPay: false,
      showCancel: false
    }
  },
  computed: {
    ...mapState('m_user', ['userInfo'])
  },
  methods: {
    changeActive(active) {
      this.active = active
      if (active == 'history') this.getHistoryOrderList()
    },
    // 获取当前订单
    async getCurrentOrderList() {
      if (!this.userInfo.user_state)
        return uni.$showMsg('您尚未登录,请先登录再查看订单吧')
      const { data: res } = await uni.$http.get('/api/get/order/current', {
        user_id: this.userInfo.user_id
      })
      if (res.meta.status !== 200) return uni.$showMsg
      if (res.data.length !== 0) {
        this.current_state = false
      } else {
        this.current_state = true
      }
      for (let i = 0; i < res.data.length; i++) {
        uni.$http
          .get(`/api/now/order?day_id=${res.data[i].order_id}`)
          .then(({ data: res2 }) => {
            res.data[i].howManyOrderBefore = res2.data
            this.currentOrderList.push(res.data[i])
            // console.log(this.currentOrderList)
          })
      }
    },
    // 获取历史订单
    async getHistoryOrderList() {
      if (!this.userInfo.user_state)
        return uni.$showMsg('您尚未登录,请先登录再查看订单吧')
      const { data: res } = await uni.$http.get('/api/get/order/history', {
        user_id: this.userInfo.user_id
      })
      if (!res.data.length == 0) {
        this.history_state = false
      } else {
        this.history_state = true
      }
      if (res.meta.status !== 200) return uni.$showMsg
      this.historyOrderList = res.data
    },
    confirmPay() {
      this.showPay = true
    },
    confirmCancel() {
      this.showCancel = true
    },
    closeDialog() {
      this.showPay = false
      this.showCancel = false
    },
    gotoPay(isPay, order_id) {
      if (!isPay) {
        this.closeDialog()
        return
      } else {
        this.changeOrderState(order_id, '已下单')
        this.closeDialog()
        uni.$showMsg('支付成功')
        this.currentOrderList = []
        this.getCurrentOrderList()
      }
    },
    gotoOrder(isCancel, order_id) {
      if (!isCancel) {
        this.closeDialog()
        return
      } else {
        this.changeOrderState(order_id, '已取消')
        this.closeDialog()
        uni.$showMsg('取消成功')
        this.currentOrderList = []
        this.getCurrentOrderList()
      }
    },
    async changeOrderState(order_id, order_state) {
      const { data: res } = await uni.$http.get('/api/update/order', {
        order_id,
        order_state
      })
      if (res.meta.status !== 200) console.log(res)
    },
    gotoDrink() {
      uni.switchTab({ url: '/pages/drinks/index' })
    }
  },
  watch: {
    active(newVal) {
      if (newVal == 'history') {
        this.historyOrderList = []
        this.getHistoryOrderList()
      }
    }
  },

  // 页面周期函数--监听页面加载
  onLoad() {},

  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {
    this.currentOrderList = []
    this.getCurrentOrderList()
    uni.stopPullDownRefresh()
  },
  onShow() {
    this.currentOrderList = []
    this.getCurrentOrderList()
    this.active = 'current'
  }
}
</script>

<style lang="less" scoped>
.order {
  .navigatorBar {
    width: 100%;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
    .space {
      height: 70rpx;
    }
    .bibo {
      font-size: 36rpx;
      font-weight: 500;
      margin-left: 20rpx;
    }
    .orderCheck {
      display: flex;
      justify-content: space-around;
      .order-select {
        margin: 0 80rpx 0 80rpx;
        margin-top: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #505050;
        &.active {
          color: orange;
          border-bottom: 1px solid orange;
        }
      }
    }
  }
  .order-content {
    .order-current {
      display: flex;
      flex-direction: column;
      align-items: center;
      .no-order {
        height: 480rpx;
        margin-top: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .no-order-img {
          width: 300rpx;
          height: 300rpx;
        }
        .no-order-text {
          height: 80rpx;
          font-size: 26rpx;
          color: orange;
        }
        .no-order-btn {
          width: 220rpx;
          height: 80rpx;
          line-height: 80rpx;
          font-size: 30rpx;
          background-color: #f7b52c;
          color: #fff;
        }
      }
      .orders {
        width: 90%;
        background-color: #fff;
        border-radius: 18rpx;
        margin-top: 50rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .orders-item {
          width: 90%;
          padding: 30rpx 0;
          border-bottom: 1px solid #d0d0d0;
          display: flex;
          justify-content: center;
          align-items: center;
          .state {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;
            padding: 40rpx 0;
            .state-item {
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              align-items: center;
              font-size: 20rpx;
              height: 100rpx;
              &.making {
                color: #808080;
              }
              .state-order-img {
                width: 50rpx;
                height: 50rpx;
              }
            }
            .state-ellipsis {
              font-size: 50rpx;
              word-spacing: 40rpx;
              width: 20%;
              overflow: hidden;
              display: block;
              height: 80rpx;
              // line-height: 80rpx;
            }
          }
          .tips {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 150rpx;
            margin: 20rpx 0;
            .btn {
              width: 520rpx;
              display: flex;
              justify-content: space-between;
              .btn-cancel {
                width: 220rpx;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;
                background-color: #fff;
                border: 2px solid #f7b52c;
                color: #f7b52c;
              }
              .btn-pay {
                width: 220rpx;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;
                background-color: #f7b52c;
                color: #fff;
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
          .making {
            font-size: 30rpx;
            display: flex;
            flex-direction: column;
            margin-bottom: 20rpx;
          }
        }
      }
    }
    .order-history {
      display: flex;
      flex-direction: column;
      align-items: center;
      .no-order {
        height: 480rpx;
        margin-top: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .no-order-img {
          width: 300rpx;
          height: 300rpx;
        }
        .no-order-text {
          height: 80rpx;
          font-size: 26rpx;
          color: orange;
        }
        .no-order-btn {
          width: 220rpx;
          height: 80rpx;
          line-height: 80rpx;
          font-size: 30rpx;
          background-color: #f7b52c;
          color: #fff;
        }
      }
      .order-item {
        width: 90%;
        background-color: #fff;
        border-radius: 18rpx;
        margin-top: 50rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>

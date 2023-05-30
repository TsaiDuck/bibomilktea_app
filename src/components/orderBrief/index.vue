<template>
  <div class="orderBrief">
    <div class="orders-item" style="border-bottom: 0">
      <div class="orderInfo">
        <!-- 店铺信息 -->
        <div class="order-shop">
          <span>河北工业大学廊坊分校8号楼店</span>
          <span style="font-size: 26rpx">{{ order.order_state }}</span>
        </div>
        <!-- 订单编号，日期信息 -->
        <div class="order-basicInfo">
          <span>订单编号：{{ order.order_id }}</span>
          <span>订单生成日期：{{ order.order_time }}</span>
        </div>
        <!-- 自取/外卖 -->
        <span class="order-take-way">{{ order.order_take_way }}</span>
        <!-- 饮品信息 -->
        <div class="order-drinks">
          <!-- 图片区 -->
          <!-- 订单有多杯饮品时 -->
          <div class="scroll-box" v-if="orderCartList.length > 1">
            <scroll-view scroll-x class="scroll">
              <image
                v-for="(item, i) in orderCartList"
                :key="item.cart_id"
                :src="item.good_img"
                class="scroll-img"
              />
            </scroll-view>
          </div>
          <!-- 订单只有一杯时 -->
          <div class="drinks-box" v-else>
            <!-- 图片 -->
            <image :src="orderCartList[0].good_img" class="good_img" />
            <!-- 信息 -->
            <div class="drinks-info">
              <!-- 名字 -->
              <span>{{ orderCartList[0].good_name }}</span>
              <!-- 规格信息 -->
              <span class="drinks-info-size"
                >已选：{{ orderCartList[0].good_size }}/{{
                  orderCartList[0].good_ice
                }}/{{ orderCartList[0].good_sugar }}
                <span v-for="(item, i) in orderCartList[0].good_etc" :key="i"
                  >/{{ item[0] }}</span
                ></span
              >
            </div>
          </div>
          <!-- 订单信息 -->
          <div class="order-information">
            <span>￥{{ order.order_price.toFixed(2) }}</span>
            <span style="color: gray; font-size: 26rpx"
              >共{{ order.order_count }}件</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderBrief',
  props: {
    order: {}
  },
  data() {
    return {
      orderCartList: []
    }
  },
  computed: {},
  methods: {
    getCartList() {
      uni.$http
        .get(`/api/orderid/cart?order_id=${this.order.order_id}`)
        .then(({ data: res }) => {
          this.orderCartList = this.orderCartList.concat(res.data)
        })
    }
  },
  watch: {},

  mounted() {
    this.getCartList()
  }
}
</script>

<style lang="less" scoped>
.orderBrief {
  width: 100%;
  background-color: #fff;
  border-radius: 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .orders-item {
    width: 100%;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #d0d0d0;
    display: flex;
    justify-content: center;
    align-items: center;
    .orderInfo {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;
      .order-shop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 36rpx;
      }
      .order-basicInfo {
        display: flex;
        flex-direction: column;
        height: 100rpx;
        justify-content: space-evenly;
        color: gray;
        font-size: 24rpx;
      }
      .order-take-way {
        display: block;
        width: 60rpx;
        padding: 6rpx 10rpx;
        text-align: center;
        margin: 10rpx 0;
        font-size: 26rpx;
        color: orange;
        border: 1px solid orange;
      }
      .order-drinks {
        display: flex;
        justify-content: space-between;
        margin-top: 10rpx;
        .scroll-box {
          .scroll {
            white-space: nowrap;
            overflow-x: auto;
            width: 460rpx;
            .scroll-img {
              width: 120rpx;
              height: 120rpx;
              margin-right: 10rpx;
            }
          }
        }
        .drinks-box {
          display: flex;
          .good_img {
            width: 120rpx;
            height: 120rpx;
            margin-right: 10rpx;
          }
          .drinks-info {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            font-size: 26rpx;
            color: #505050;
            .drinks-info-size {
              display: block;
              width: 300rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .order-information {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          font-size: 32rpx;
        }
      }
    }
  }
}
</style>

<template>
  <div class="goodList">
    <!-- 图片 -->
    <image :src="good.good_img" class="good-img" @click="openDetail" />
    <!-- 内容 -->
    <div class="good-content" @click="openDetail">
      <!-- 商品名 -->
      <div class="good-name">{{ good.good_name }}</div>
      <!-- 商品信息 -->
      <span class="good-info" :style="{ width: setWidth + 'rpx' }">{{
        good.good_info
      }}</span>
      <!-- 底边栏 -->
      <div class="good-bottom">
        <!-- 商品价格 -->
        <div class="good-pirce">
          <span style="font-size: 24rpx; font-weight: small">￥</span>
          <span>{{ good.good_price.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <!-- 添加按钮 -->
    <span class="good-btn-add" @click="openChoice">+</span>
    <!-- 详细信息 -->
    <van-popup
      :show="showDetail"
      closeable
      position="bottom"
      custom-style="height: 50%"
      @close="closeDetail"
      round
    >
      <div class="detail">
        <image :src="good.good_img" mode="heightFix" class="detail-img" />
        <div class="detail-content">
          <div class="detail-content-name">{{ good.good_name }}</div>
          <div class="detail-content-info">{{ good.good_info }}</div>
        </div>
        <div class="detail-bottom">
          <div class="detail-bottom-price">
            <span style="font-size: 24rpx; font-weight: small">￥</span>
            <span>{{ good.good_price.toFixed(2) }}</span>
          </div>
          <span class="detail-bottom-btn-add" @click="openChoice">+</span>
        </div>
      </div>
    </van-popup>
    <!-- 奶茶选择 -->
    <van-popup
      :show="showChoice"
      closeable
      position="bottom"
      custom-style="height: 65%"
      @close="closeChoice"
      round
    >
      <div class="choice">
        <div class="choice-good-info">
          <image
            :src="good.good_img"
            mode="heightFix"
            class="choice-good-img"
          />
          <div class="choice-good-content">
            <div class="choice-good-content-name">{{ good.good_name }}</div>
            <div class="choice-good-content-specification">
              <span
                >已选：{{ goodSize.size }}/{{ goodSize.ice }}/{{
                  goodSize.sugar
                }}
                <span v-for="(item, i) in goodSize.etc" :key="i"
                  >/{{ item[0] }}</span
                >
              </span>
            </div>
            <div class="choice-good-content-price">
              <span style="font-size: 24rpx; font-weight: small">￥</span>
              <span>{{ good.good_price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="choice-size" :style="{ height: setHeight }">
          <div class="choice-size-item" v-for="(item, i) in sizeValue" :key="i">
            <span class="choice-size-item-title">{{ sizeTitle[i] }}</span>
            <div class="choice-size-item-value-box">
              <span
                v-for="(item2, i2) in item"
                :key="i2"
                :class="[
                  'choice-size-item-value',
                  Object.values(goodSize)[i] == item2 ? 'value-active' : ''
                ]"
                @click="changeSize(i, item2)"
                >{{ item2 }}</span
              >
            </div>
          </div>
          <div class="choice-size-item">
            <span class="choice-size-item-title">配料</span>
            <div class="choice-size-item-value-box">
              <span
                v-for="(item, i) in specification"
                :key="i"
                :class="[
                  'choice-size-item-value',
                  goodSize.etc.includes(item) ? 'value-active' : ''
                ]"
                @click="changeGoodSizeETC(item)"
                >{{ item[0]
                }}<text style="color: orange">￥{{ item[1] }}</text></span
              >
            </div>
          </div>
        </div>
        <button class="choice-btn" @click="selectOK">选好了</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'goodList',
  props: {
    good: {
      type: Object
    },
    setWidth: {},
    windowHeight: {}
  },
  data() {
    return {
      setHeight: 0,
      showDetail: false,
      showChoice: false,
      sizeTitle: ['杯型', '冰度', '糖度'],
      sizeValue: [
        ['中杯', '大杯'],
        ['标准冰', '少冰', '去冰', '常温', '温', '热饮'],
        ['七分糖', '全糖']
      ],
      specification: [
        ['珍珠', 0],
        ['波霸', 0],
        ['野果', 0],
        ['红豆', 0],
        ['燕麦', 1],
        ['咖啡冻', 2],
        ['布丁', 4],
        ['芒果酱', 6],
        ['芋圆', 2],
        ['紫米', 1],
        ['去糖改蜜', 5]
      ],
      goodSize: {
        size: '中杯',
        ice: '标准冰',
        sugar: '七分糖',
        etc: [],
        count: 1
      }
    }
  },
  computed: {},
  methods: {
    ...mapMutations('m_cart', ['addCart']),
    closeDetail() {
      this.showDetail = false
    },
    openDetail() {
      this.showDetail = true
    },
    openChoice() {
      this.showDetail = false
      this.showChoice = true
    },
    closeChoice() {
      this.showChoice = false
    },
    changeSize(i, size) {
      for (let key in this.goodSize) {
        if (Object.keys(this.goodSize)[i] == key) {
          this.goodSize[key] = size
        }
      }
    },
    changeGoodSizeETC(item) {
      const index = this.goodSize.etc.indexOf(item)
      if (index == -1) {
        this.goodSize.etc.push(item)
      } else {
        this.goodSize.etc.splice(index, 1)
      }
    },
    selectOK() {
      this.goodSize.good_id = this.good.good_id
      this.goodSize.good_name = this.good.good_name
      this.goodSize.good_img = this.good.good_img
      this.goodSize.good_price = this.good.good_price
      console.log(this.goodSize)
      this.showChoice = false
      this.addCart(this.goodSize)
    }
  },
  mounted() {
    this.setHeight = this.windowHeight * 0.4 + 'px'
  }
}
</script>

<style lang="less">
.goodList {
  display: flex;
  align-items: center;
  padding-bottom: 20rpx;
  position: relative;
  background-color: #fff;
  height: 180rpx;
  .good-img {
    width: 160rpx;
    height: 160rpx;
  }
  .good-content {
    margin-left: 20rpx;
    margin-right: 0rpx;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .good-name {
      font-size: 36rpx;
    }
    .good-info {
      font-size: 28rpx;
      color: gray;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .good-bottom {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .good-price {
        font-size: 32rpx;
        font-weight: bold;
      }
    }
  }
  .good-btn-add {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background-color: #f7b52c;
    color: #fff;
    text-align: center;
    line-height: 32rpx;
    font-size: 48rpx;
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
  }
  .detail {
    height: 580rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .detail-img {
      height: 360rpx;
      margin-top: 20rpx;
    }
    .detail-content {
      width: 90%;
      .detail-content-name {
        font-size: 32rpx;
        font-weight: bold;
      }
      .detail-content-info {
        height: 120rpx;
        font-size: 24rpx;
        color: gray;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .detail-bottom {
      display: flex;
      justify-content: space-between;
      width: 90%;
      .detail-bottom-price {
        font-size: 32rpx;
        font-weight: bold;
      }
      .detail-bottom-btn-add {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: #f7b52c;
        color: #fff;
        text-align: center;
        line-height: 32rpx;
        font-size: 48rpx;
      }
    }
  }
  .choice {
    margin: 20rpx;
    background-color: #fff;
    position: relative;
    height: 95%;
    .choice-good-info {
      display: flex;
      height: 200rpx;
      .choice-good-img {
        height: 100%;
      }
      .choice-good-content {
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .choice-good-content-name {
          font-size: 40rpx;
          font-weight: 500;
        }
        .choice-good-content-specification {
          width: 320rpx;
          height: 80rpx;
          overflow: hidden visible;
          font-size: 28rpx;
          color: gray;
        }
        .choice-good-content-price {
          font-size: 36rpx;
          font-weight: bold;
          color: red;
        }
      }
    }
    .choice-size {
      width: 100%;
      overflow: scroll;
      margin-top: 30rpx;
      .choice-size-item {
        margin-bottom: 20rpx;
        .choice-size-item-title {
          font-size: 32rpx;
        }
        .choice-size-item-value-box {
          display: flex;
          flex-wrap: wrap;
          margin-top: 30rpx;
          .choice-size-item-value {
            display: block;
            font-size: 28rpx;
            padding: 16rpx 28rpx;
            background-color: #eee;
            margin-right: 40rpx;
            margin-bottom: 30rpx;
            border-radius: 10rpx;
            &.value-active {
              background-color: #ffedce;
              color: orange;
            }
          }
        }
      }
    }
    .choice-btn {
      position: absolute;
      bottom: 0rpx;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 10rpx;
      background-color: #f7b52c;
      color: #fff;
      font-size: 34rpx;
    }
  }
}
</style>

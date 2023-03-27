<template>
  <div class="goodList">
    <!-- 图片 -->
    <image :src="good.good_img" class="good-img" />
    <!-- 内容 -->
    <div class="good-content">
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
          <span>{{ good.good_price }}</span>
        </div>
      </div>
    </div>
    <!-- 添加按钮 -->
    <btn class="good-btn-add">+</btn>
  </div>
</template>

<script>
export default {
  name: 'goodList',
  props: {
    good: {
      type: Object
    },
    setWidth: {}
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {}
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
}
</style>

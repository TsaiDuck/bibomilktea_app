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
          class="scroll-left-item"
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
      >
        <div class="good-list" v-for="(item, i) in goodClassList" :key="i">
          <span class="good-list-span">找{{ item }}</span>
          <uniGood
            v-for="(item2, i2) in goodList.filter((x) => x.good_class === item)"
            :key="item2.good_id"
            :good="item2"
            :setWidth="410"
          ></uniGood>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import uniGood from '@/components/goodList/index'
export default {
  components: { uniGood },
  data() {
    return {
      goodList: [],
      windowHeight: Number,
      goodClassList: []
    }
  },
  computed: {},
  methods: {
    async getGoodList() {
      const { data: res } = await uni.$http.get('/api/goodlist')
      if (res.meta.status !== 200) return uni.$showMsg()
      this.goodList = res.data
      this.goodClassList = [...new Set(this.goodList.map((x) => x.good_class))]
    },
    scrollRight(e) {
      console.log(e)
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getGoodList()
    this.windowHeight = uni.getSystemInfoSync().windowHeight - 90

    console.log(this.windowHeight)
  }
}
</script>

<style lang="less">
.drinks {
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
        height: 100rpx;
        line-height: 100rpx;
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
}
</style>

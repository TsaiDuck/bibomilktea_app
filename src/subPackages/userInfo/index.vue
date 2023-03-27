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
      <div class="content-tips">我的资料</div>
      <!-- 资料内容 -->
      <div class="content-info">
        <div class="info-item">
          <text class="info-title">昵称</text>
          <div class="info-content">
            <input
              type="text"
              placeholder="请输入昵称"
              v-model="user_info.user_name"
            />
          </div>
          <div class="info-operation"></div>
        </div>
        <div class="info-item">
          <text class="info-title">手机</text>
          <div class="info-content">
            <span>{{ user_info.user_phone }}</span>
          </div>
          <div class="info-operation"></div>
        </div>
        <div class="info-item">
          <text class="info-title">生日</text>
          <div class="info-content">
            <span @click="showDate">{{
              user_info.user_birthday || '请选择日期'
            }}</span>
            <van-popup
              :show="showDateSelector"
              position="bottom"
              custom-style="height: 50%;"
              @close="onClose"
            >
              <van-datetime-picker
                type="date"
                :value="birthday.currentDate"
                @input="onInput"
                :min-date="birthday.minDate"
                :max-date="birthday.now"
                @confirm="setUserBirthday"
                @cancel="onClose"
              />
            </van-popup>
          </div>
          <div class="info-operation"></div>
        </div>
        <div class="info-item">
          <text class="info-title">性别</text>
          <div class="info-content">
            <span @click="showGender">{{ user_info.user_gender }}</span>
            <van-popup
              :show="showGenderSelector"
              position="bottom"
              custom-style="height: 30%;"
              @close="onClose"
            >
              <van-picker
                :columns="genderItem"
                @confirm="setUserGender"
                @cancel="onClose"
                :default-index="0"
                show-toolbar
                title="性别"
              />
            </van-popup>
          </div>
          <div class="info-operation"></div>
        </div>
        <div class="info-item">
          <text class="info-title">地址</text>
          <div class="info-content">
            <input
              type="text"
              placeholder="请输入收货地址"
              v-model="user_info.user_address"
            />
          </div>
          <div class="info-operation"></div>
        </div>
      </div>
      <!-- 选项 -->
      <div class="operate-select">
        <!-- 保存按钮 -->
        <button class="btn-save" @click="saveUserInfo">保存</button>
        <!-- 退出登录 -->
        <text class="text-quit" @click="logout">退出登录</text>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      birthday: {
        currentDate: new Date().getTime(),
        now: new Date().getTime(),
        minDate: Date.parse('1970/1/1 10:00')
      },
      user_info: {
        user_id: Number,
        user_name: '',
        user_phone: '',
        user_birthday: '',
        user_gender: '',
        user_address: ''
      },
      showDateSelector: false,
      showGenderSelector: false,
      genderItem: ['未知', '男', '女'],
      genderPicker: ''
    }
  },
  computed: {
    ...mapState('m_user', ['userInfo'])
  },
  methods: {
    ...mapMutations('m_user', ['logout']),
    ...mapActions('m_user', ['postUpdateUserInfo']),
    onInput(e) {
      this.birthday.currentDate = e.detail
    },
    showDate() {
      this.showDateSelector = true
    },
    showGender() {
      this.showGenderSelector = true
    },
    onClose() {
      this.showDateSelector = false
      this.showGenderSelector = false
    },
    setUserBirthday() {
      const birthday = new Date(this.birthday.currentDate)
      const y = birthday.getFullYear()
      const m = birthday.getMonth() + 1
      const d = birthday.getDate()
      this.user_info.user_birthday = `${y}-${m}-${d}`
      this.onClose()
    },
    setUserInfo() {
      this.user_info = this.userInfo
    },
    setUserGender(e) {
      this.user_info.user_gender = e.detail.value
      this.onClose()
    },
    saveUserInfo() {
      console.log(this.user_info)
      this.postUpdateUserInfo(this.user_info)
    },
    back() {
      uni.navigateBack({ delta: 1 })
    }
  },
  onLoad(options) {
    this.setUserInfo()
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
      .info-title {
        width: 60rpx;
      }
      .info-content {
        width: 200rpx;
      }
      .info-item {
        width: 90%;
        height: 120rpx;
        border-bottom: 1px solid #efefef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-operation {
          width: 100rpx;
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

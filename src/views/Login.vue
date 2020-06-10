<template>
  <div class="news-login">
    <van-nav-bar title="登录" />
    <van-form @submit="onLogin" ref="loginForm" class="news-login-form">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        left-icon="phone-o"
        placeholder="请输入手机号"
        required
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: /^1\d{10}/, message: '请输入有效的手机号码' },
        ]"
      >
        <template #left-icon>
          <i class="iconfont icon-phone"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        left-icon="[user.? ]"
        name="code"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }, { pattern: /^\d{6}$/, message: '请输入6位的验证码' }]"
      >
        <template #left-icon>
          <i class="iconfont icon-ecurityCode"></i>
        </template>
        <template #button>
          <van-count-down
            :time="60 * 1000"
            format="ss 秒"
            v-if="isShowCountDown"
            @finish="onCountDownFinish"
          />
          <van-button
            round
            color="#ededed"
            size="small"
            type="info"
            v-else
            @click="onSendCaptcha"
            class="news-captcha"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button class="news-login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCaptcha } from "@/api/user.js";
export default {
  data() {
    return {
      user: {
        mobile: "",
        code: ""
      },
      isShowCountDown: false
    };
  },
  methods: {
    async onLogin() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "登录中..."
      });
      try {
        const { data: res } = await login(this.user);
        this.$store.commit("setUser", res.data);
        this.$toast.success("登录成功");
        this.$router.push("/home");
      } catch (err) {
        this.$toast.fail("登录失败， 手机号或验证码错误 ");
      }
    },
    async onSendCaptcha() {
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (e) {
        this.$toast.fail("必须先输入手机号");
        return;
      }

      this.isShowCountDown = true;
      try {
        const { data: res } = await sendCaptcha(this.user.mobile);
        this.$toast.success(
          "验证码已发送到".concat(res.data.mobile).concat("手机号中")
        );
      } catch (e) {
        if (e.response.status === 404) {
          this.$toast.fail("手机号不正确");
        } else if (e.response.status === 429) {
          this.$toast.fail("发送验证码太频繁，请一分钟后再试");
        }
      }
    },
    async onCountDownFinish() {
      this.isShowCountDown = false;
    }
  }
};
</script>

<style lang="scss">
.news-login-form {
  margin: 15px;
}
.news-login-btn {
  margin-top: 27px;
  width: 347px;
  height: 44px;
  border-radius: 5px;
  font-size: 16px;
  color: #ffffff;
  background-color: #6db4fb;
}
.news-captcha {
  color: #666666 !important;
}
.news-login .van-count-down {
  color: #ccc;
}
</style>

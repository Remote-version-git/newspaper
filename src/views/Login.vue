<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button class="news-login" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss">
.news-login {
  width: 347px;
  height: 44px;
  background-color: #6db4fb;
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  color: #ffffff;
}
</style>

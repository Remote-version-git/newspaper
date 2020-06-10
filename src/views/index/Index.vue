<template>
  <div class="Index">
    <router-view />
    <van-tabbar v-model="active" placeholder>
      <van-tabbar-item to="/index">
        <span>首页</span>
        <template #icon>
          <i class="iconfont icon-i-home" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/answer">
        <span>问答</span>
        <template #icon>
          <i class="iconfont icon-qa" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <span>视频</span>
        <template #icon>
          <i class="iconfont icon-shipin" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span>我的</span>
        <template #icon>
          <i class="iconfont icon-profile" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "index",
  data() {
    return {
      active: 0
    };
  }
};
</script>

<template>
  <div class="news-home">
    <!-- 标题 -->
    <van-nav-bar fixed placeholder>
      <van-button slot="title" plain icon="search">搜索</van-button>
    </van-nav-bar>
    <van-tabs v-model="active" sticky offset-top="46">
      <!-- 频道 -->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 列表 -->
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getAllChannels } from "@/api/news.js";
export default {
  created() {
    (async () => {
      try {
        const { data: res } = await getAllChannels();
        this.channels = res.data.channels;
        console.log(this.channels);
      } catch (error) {
        this.$toast.fail("服务器数据库发生错误");
      }
    })();
  },
  data() {
    return {
      active: 2,
      list: [],
      loading: false,
      finished: false,
      channels: []
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
.news-home {
  .van-nav-bar__title {
    width: 278px;
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 16px;
  }
  .van-button {
    border: none;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    &__icon {
      color: #fff;
    }
    &__text {
      color: #fff;
    }
  }
}
</style>
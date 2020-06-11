<template>
  <div class="news-home">
    <!-- 标题 -->
    <van-nav-bar fixed placeholder>
      <van-button slot="title" plain icon="search">搜索</van-button>
    </van-nav-bar>
    <van-tabs v-model="active" sticky offset-top="46">
      <!-- 频道 -->
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!-- 上拉刷新列表 -->
          <van-list
            v-model="loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getAllChannels, getArticles } from "@/api/news.js";
export default {
  created() {
    (async () => {
      try {
        const { data: res } = await getAllChannels();
        const channels = res.data.channels;
        channels.forEach(channel => {
          // 改造为每个频道添加自已的文章数据容器 和 是否数据装载完成标识
          channel.articles = [];
          channel.finished = false;
          channel.timestamp = null;
        });
        this.channels = channels;
        console.log(this.channels);
      } catch (error) {
        this.$toast.fail("服务器数据库发生错误");
      }
    })();
  },
  data() {
    return {
      active: 2,
      loading: false,
      finished: false,
      channels: [],
      isLoading: false
    };
  },
  methods: {
    async onLoad() {
      // 获取对应频道数据对象
      const activeChannel = this.channels[this.active];
      // 获取对应频道的文章数据
      const articles = activeChannel.articles;
      // 异步更新数据
      const { data: res } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: activeChannel.timestamp || Date.now(),
        with_top: 1
      });
      articles.push(...res.data.results);

      // 改变本次装载状态为false 表示装载数据结束
      this.loading = false;

      const preTimestamp = res.data.pre_timestamp;
      if (preTimestamp) {
        activeChannel.timestamp = preTimestamp;
      } else {
        // 表示数据全部装载完成，此时设置finished为true，表示不再检测load事件
        activeChannel.finished = true;
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast.success("刷新成功");
        this.isLoading = false;
      }, 2000);
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
<template>
  <div class="news-home">
    <!-- 标题 -->
    <van-nav-bar fixed placeholder>
      <van-button slot="title" type="info" icon="search" size="mini" round @click="$router.push({ path: '/search' })">搜索</van-button>
    </van-nav-bar>
    <!-- 频道 -->
    <van-tabs v-model="active" sticky offset-top="46">
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
            >
              <template slot="label">
                <!-- 图片 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" lazy-load :src="img" />
                  </van-grid-item>
                </van-grid>
                <!-- 信息 -->
                <div class="article-info">
                  <span>{{ article.aut_name }}</span>
                  <span>{{ article.comm_count }}评论</span>
                  <span>{{ article.pubdate | relativeTime }}</span>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- 导航频道编辑按钮 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon name="wap-nav" size="24" />
      </div>
    </van-tabs>
    <!-- /频道 -->

    <!-- 频道编辑层 -->
    <van-popup
      @open="onChannelOpen"
      v-model="isChannelShow"
      round
      position="bottom"
      closeable
      close-icon-position="top-right"
      style="height: 95%;"
    >
      <div class="channel-container">
        <!-- 我的频道 -->
        <van-cell title="我的频道" :border="false">
          <van-button
            type="danger"
            size="mini"
            @click="isEditShow = !isEditShow"
          >{{ isEditShow ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            @click="onChannelActiveOrDelete(channel, index)"
            v-for="(channel, index) in channels"
            :key="channel.id"
            :text="channel.name"
          >
            <!-- 删除图标 -->
            <van-icon
              v-show="isEditShow && channel.name !== '推荐'"
              class="close-icon"
              slot="icon"
              name="close"
              size="20"
            />
          </van-grid-item>
        </van-grid>

        <!-- 推荐频道 -->
        <van-cell title="推荐频道" :border="false" />
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in recommendChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onChannelAdd(channel)"
          ></van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels, getArticles } from "@/api/news.js";
import { getUserChannels } from "@/api/user.js";
import { getItem, setItem } from "@/utils/localStorage.js";
export default {
  created() {
    (async () => {
      try {
        // 优先取本地持久化数据
        let channels = getItem("channels");
        // 如果没有就请求
        if (!channels) {
          const { data: res } = await getUserChannels();
          channels = res.data.channels;
          channels.forEach(channel => {
            // 改造为每个频道添加自已的文章数据容器 和 是否数据装载完成标识
            channel.articles = [];
            channel.finished = false;
            channel.timestamp = null;
          });
        }
        // 最后赋值
        this.channels = channels;
      } catch (error) {
        this.$toast.fail("服务器数据库发生错误");
      }
    })();
  },
  data() {
    return {
      // 当前位于频道
      active: 0,
      // 上拉刷新
      loading: false,
      // 频道数据
      channels: [],
      // 控制下拉刷新
      isLoading: false,
      // 控制频道管理面板
      isChannelShow: false,
      // 全部频道
      allChannels: [],
      // 记录是否显示编辑图标
      isEditShow: false
    };
  },
  methods: {
    // 上拉刷新
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
    // 下拉刷新
    async onRefresh() {
      const activeChannel = this.channels[this.active];
      const { data: res } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(),
        with_top: 1
      });
      const articles = res.data.results;
      // 往当前激活频道文章数组开头添加展开的文章对象
      activeChannel.articles.unshift(...articles);
      // 表示此次装载结束
      this.isLoading = false;
      // 提示
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : "无数据更新";
      this.$toast(message);
    },
    // 获取全部推荐频道
    async onChannelOpen() {
      const { data: res } = await getAllChannels();
      const allChannels = res.data.channels;
      // 扩展文章数据属性
      allChannels.forEach(channel => {
        // 频道的文章列表
        channel.articles = [];
        // 频道文章的加载全部完成状态
        channel.finished = false;
        // 用于获取频道下一页数据的时间戳
        channel.timestamp = null;
      });
      this.allChannels = allChannels;
    },
    // 处理频道添加
    onChannelAdd(channel) {
      // 当channels数据改变，就会影响推荐频道的渲染, 这就是计算属性的好处
      this.channels.push(channel);
    },
    // 处理频道切换 或者 删除
    onChannelActiveOrDelete(channel, index) {
      if (this.isEditShow && channel.name !== "推荐") {
        // 编辑状态为 删除
        this.channels.splice(index, 1);
      } else {
        //  没有开启编辑状态 跳转频道
        this.active = index;
        // 面板隐藏
        this.isChannelShow = false;
      }
    }
  },
  computed: {
    // 推荐频道计算属性
    recommendChannels() {
      return this.allChannels.filter(channel => {
        const result = !this.channels.find(item => item.id === channel.id);
        return result;
      });
    }
  },
  // 属性监听
  watch: {
    channels: {
      handler() {
        // 持久化数据到浏览器的 localStorage 本地仓库
        setItem("channels", this.channels);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.news-home {
  .van-grid-item__icon-wrapper {
    position: absolute;
    top: -12px;
    right: -7px;
  }
  .channel-container {
    margin-top: 38px;
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
  .article-info span {
    margin-right: 10px;
  }
  .van-nav-bar__title {
    width: 278px;
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 16px;
  }
  .van-nav-bar__title .van-button {
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

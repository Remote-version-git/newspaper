<template>
  <div class="article-container">
    <!-- title area-->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <!-- /title area -->
    <!-- loading -->
    <van-loading class="article-loading" v-if="loading" />
    <!-- /loading -->
    <!-- article detail -->
    <div class="detail" v-else-if="article.title">
      <div class="title">{{article.title}}</div>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relativeTime }}</p>
        </div>
        <van-button round size="small" type="info">+ 关注</van-button>
      </div>
      <!-- article content area -->
      <div class="content" v-html="article.content"></div>
      <!-- /article content area -->
      <div class="zan">
        <van-button round size="small" hairline type="primary" plain icon="good-job-o">点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- /article detail -->
    <!-- loading reject message tips -->
    <div class="error" v-else>
      <p>网络超时,点击</p>
      <a href="#" @click.prevent="loadArticle">刷新</a>试一试。
    </div>
    <!-- /loading reject message tips -->
  </div>
</template>

<script>
// 文章详情接口
import { getArticle } from "@/api/article.js";
export default {
  name: "ArticleIndex",
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      article: {}
    };
  },
  created() {
    //   获取文章详情
    this.loadArticle();
  },
  methods: {
    //   文章详情
    async loadArticle() {
      this.loading = true;
      try {
        const res = await getArticle(this.articleId);
        this.article = res.data.data;
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>
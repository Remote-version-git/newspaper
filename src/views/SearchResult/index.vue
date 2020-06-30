<template>
  <div class="news-search-result">
    <van-nav-bar :title="title" left-arrow @click-left="$router.back()" />

    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from "@/api/search";
export default {
  data() {
    return {
      list: [],
      // 是否正在装载数据
      loading: false,
      // 数据是否全部装载完成,为真时 list组件 不再触发 loading 事件
      finished: false,
      // page code
      page: 1
    };
  },
  computed: {
    title() {
      return `${this.$route.params.keywords}的搜索结果`;
    }
  },
  methods: {
    async onLoad() {
      const res = await getSearch({
        page: this.page,
        per_page: 20,
        q: this.$route.params.keywords
      });

      const results = res.data.data.results;
      this.list.push(...results);

      // 这次装载结束
      this.loading = false;
      if (results.length) {
        this.page++;
      } else {
        // 全部装载完成，不再装载
        this.finished = true;
      }
    }
  }
};
</script>

<style lang="scss">
.news-search-result {
  .van-icon-arrow-left {
    color: white;
  }
}
</style>
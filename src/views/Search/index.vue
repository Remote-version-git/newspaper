<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search
      v-model="keywords"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @input="onSearchInput"
    >
      <!-- 搜索点击按钮 -->
      <div slot="action" @click="onSearch(keywords)">搜索</div>
    </van-search>
    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell icon="search" :key="item" v-for="item in suggestions" @click="onSearch(item)">
        <div slot="title" v-html="highLights(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
        <div v-show="isShowDelete">
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isShowDelete = false">完成</span>
        </div>
        <van-icon v-show="!isShowDelete" name="delete" @click="isShowDelete = true" />
      </van-cell>
      <van-cell
        :title="item"
        :key="item"
        v-for="(item, index) in searchHistories"
        @click="onSearch(item)"
      >
        <van-icon
          v-show="isShowDelete"
          name="close"
          @click.stop="searchHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestions } from "@/api/search";
import { debounce } from "lodash";
import { getItem, setItem } from "@/utils/localStorage.js";
export default {
  name: "SearchPage",
  data() {
    return {
      keywords: "",
      suggestions: [],
      searchHistories: getItem("searchHistories") || [],
      isShowDelete: false
    };
  },
  watch: {
    searchHistories() {
      setItem("searchHistories", this.searchHistories);
    }
  },
  methods: {
    // 在点击键盘上的搜索/回车按钮后触发
    onSearch(keywords) {
      // 没有内容直接返回
      if (!keywords.trim()) return;

      // 查找之前的
      const index = this.searchHistories.indexOf(keywords);

      // 如果重复就删除
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }

      // 往前加
      this.searchHistories.unshift(keywords);

      // 持久化
      setItem("search-histories", this.searchHistories);

      this.$router.push({
        path: `/search/${keywords}`
      });
    },
    onSearchInput: debounce(async function() {
      const keywords = this.keywords.trim();
      if (!keywords) return;
      const res = await getSuggestions(keywords);
      this.suggestions = res.data.data.options;
    }, 300),
    highLights(item) {
      // 使用正则匹配出输入的关键字
      const pattern = new RegExp(this.keywords, "gi");
      // 替换的内容
      const tag = `<span style="color: red">${this.keywords}</span>`;
      // 将替换后的内容返回
      // 使用 pattern 匹配 item 的内容 并替换成 tag
      return item.replace(pattern, tag);
    }
  }
};
</script>
<style>
</style>

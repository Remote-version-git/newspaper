import Vue from "vue";
import dayjs from "dayjs";

// 导入语言包
import "dayjs/locale/zh-cn";
// 导入 dayjs 的 相对的时间 插件
import relativeTime from "dayjs/plugin/relativeTime";

// 设置dayjs使用的语言
dayjs.locale("zh-cn");

// 将插件添加到dayjs
dayjs.extend(relativeTime);

// 添加一个 Vue 全局过滤器
Vue.filter("relativeTime", (value) => {
  // 计算 从传过来的时间开始计算到当前最新时间之间的时间，
  return dayjs().from(dayjs(value));
});

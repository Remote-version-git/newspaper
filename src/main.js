import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// import register vant library file
import "./utils/vant";

// warning: please first import ui library for easy custom style override library default style

// import custome style file
import "./styles/index.scss";

// Used to set REM reference value
import "amfe-flexible";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

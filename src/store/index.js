import Vue from "vue";
import Vuex from "vuex";
import { setItem, getItem } from "@/utils/localStorage.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: getItem(),
  },
  mutations: {
    setUser(state, data) {
      setItem("user", data);
    },
  },
  actions: {},
  modules: {},
});

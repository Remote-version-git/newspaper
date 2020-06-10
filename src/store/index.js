import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")),
  },
  mutations: {
    setUser(state, data) {
      localStorage.setItem("user", JSON.stringify(data));
    },
  },
  actions: {},
  modules: {},
});

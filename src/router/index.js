import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Splash from "../views/Splash.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "splash",
    component: Splash,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

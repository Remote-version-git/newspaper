import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index/Index.vue";
import Splash from "../views/Splash.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "splash",
    component: Splash,
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    children: [
      {
        path: "/index",
        name: "home",
        component: () => import("../views/index/children/Home.vue"),
      },
      {
        path: "/answer",
        name: "answer",
        component: () => import("../views/index/children/Answer.vue"),
      },
      {
        path: "/Video",
        name: "video",
        component: () => import("../views/index/children/Video.vue"),
      },
      {
        path: "/my",
        name: "my",
        component: () => import("../views/index/children/My.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: '/search',
    component: () => import("../views/Search/index.vue"),
  },
  {
    path: '/search/:keywords',
    component: () => import('../views/SearchResult/index.vue'),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

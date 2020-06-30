import axios from "axios";
import jsonBig from "json-bigint";
// 引入Vuex
import store from "@/store";
// 因为涉及到路由跳转，在刷新令牌处理时，所以引入路由模块
import router from "../router/index.js";

// 导入配置文件
import axiosConfig from "@/config/axios.config.js";

// creating axios instance
const instance = axios.create({
  baseURL: axiosConfig.baseURL,
});

// You can add interceptors to a custom instance of axios.
// 请求拦截 -- 统一添加 token 令牌
// Add a request interceptor
instance.interceptors.request.use(
  function(config) {
    // 在请求被发送之前做一些事情
    // Do something before request is sent
    // 任务目标： 添加  token 到每个请求上
    const user = store.state.user;
    if (user) {
      // bearer 送信任、持票人,后接一个空格，这是格式要求
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // 将修改后的配置返回
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截 -- 统一处理 token令牌 过期
// Add a response interceptor
instance.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // 只要状态码是位于 2xx 的范围内，就触发这个方法
    // Do something with response data
    return response;
  },
  async function(error) {
    // 任何状态码只要是在 2xx 的范围外 就触发这个方法
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 当触发这个方法时，而且是 401 表示用户未认证，则需要去获取新的token令牌
    if (error.response && error.response.status === 401) {
      const user = store.state.user;
      // 当用户不存在 或 没有刷新令牌时，直接让用户去登录
      if (!user || !user.refresh_token) {
        router.push("/login");
        return;
      }
      try {
        //注意：这里不能使用创建出来的新 axios实例，因为这里也要附带 Authorization ，否则会被拦截覆盖掉
        const { data: res } = await axios.put(
          "/v1_0/authorizations",
          {},
          {
            headers: {
              baseURL: axiosConfig.baseURL,
              Authorization: `Bearer ${user.refresh_token}`,
            },
          }
        );
        // 刷新localStorage持久化数据，使Vuex连带改变
        store.commit("setUser", {
          ...res.data,
        });
        // 现在已刷新令牌，重新调一下本次失败的请求
        // 这个方法返回的结果 就会 返回到调用请求的地方
        // 这里要使用新创建出来的axios实例，因为要通过拦截附带token令牌
        // err.config 包含了失败请求，发请求时的配置
        // 相当于 axios({
        //
        // })
        return instance(error.config);
      } catch (error) {
        // 请求新令牌token 失败，让用户去登录
        router.push("/login");
      }
    }

    return Promise.reject(error);
  }
);

// use json-bigint package transform response json for prevent beyond int type, e.g id
// You can change defaults setting to a custom instance of axios.
// `transformResponse` allows changes to the response data to be made before
// it is passed to then/catch
instance.defaults.transformResponse = [
  function(data) {
    // Do whatever you want to transform the data
    try {
      return jsonBig.parse(data);
    } catch (e) {
      return [];
    }
  },
];

export default instance;

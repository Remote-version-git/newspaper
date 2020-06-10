import request from "../utils/request.js";

// 登录/注册
export const login = (data) => {
  return request({
    method: "POST",
    url: "/v1_0/authorizations",
    data,
  });
};

// 发送验证码
export const sendCaptcha = (mobile) => {
  return request({
    method: "GET",
    url: "/v1_0/sms/codes/" + mobile,
  });
};

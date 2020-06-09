import request from "../utils/request.js";

export const login = (data) => {
  return request({
    method: "POST",
    url: "/v1_0/authorizations",
    data,
  });
};

export const sendCaptcha = (mobile) => {
  return request({
    method: "GET",
    url: "/v1_0/sms/codes/" + mobile,
  });
};

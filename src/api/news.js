import request from "../utils/request.js";

export const getAllChannels = () => {
  return request.get("/v1_0/channels");
};

export const getArticles = (params) => {
  return request.get("/v1_1/articles", {
    params,
  });
};

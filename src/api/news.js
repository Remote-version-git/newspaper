import request from "../utils/request.js";

export const getAllChannels = () => {
  return request.get("/v1_0/channels");
};

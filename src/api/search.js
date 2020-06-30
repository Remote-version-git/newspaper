import request from "../utils/request.js";

// 获取联想结果
export const getSuggestions = (q) => {
    return request.get("/v1_0/suggestion", { params: { q } });
}
// 获取搜索结果
export const getSearch = (params) => {
    return request.get("/v1_0/search", {
        params: {
            ...params
        }
    })
}
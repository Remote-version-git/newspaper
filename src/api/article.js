import request from '@/utils/request.js';
export function getArticle(articleId) {
    return request({
        method: "GET",
        url: `/v1_0/articles/${articleId}`,
    })
}
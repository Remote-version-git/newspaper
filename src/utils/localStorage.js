// 针对浏览器本地存储 通过 JSON 一层封装
// 用于持久化数据到浏览器

// 获取项 经过 JSON 解析成js对象
export const getItem = (name) => {
  return JSON.parse(window.localStorage.getItem(name));
};

// 设置项 经过 JSON 进行字符序列化
export const setItem = (key, value) => {
  return window.localStorage.setItem(key, JSON.stringify(value));
};

// 删除项
export const removeItem = (key) => {
  window.localStorage.removeItem(key);
};
